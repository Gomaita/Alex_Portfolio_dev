"""One bounded diagnostic actor; database leases fence duplicate deliveries.

The dispatcher lives in the worker process. Jobs are their own transactional outbox;
no HTTP request must publish successfully to Redis to durably accept a job.
"""

import logging
import signal
import threading
import uuid
from datetime import timedelta

import dramatiq
from dramatiq.brokers.redis import RedisBroker
from dramatiq.middleware import AgeLimit, Retries, TimeLimit
from redis import Redis
from sqlalchemy import or_, select, text

from app.core.config import get_settings
from app.db.models import Job, now
from app.db.session import database
from app.services.jobs import transition


class Runtime:
    def __init__(self, settings):
        self.engine, self.sessions = database(settings.database_url.get_secret_value())
        self.redis = Redis.from_url(
            settings.redis_url.get_secret_value(), socket_timeout=3, socket_connect_timeout=3
        )
        self.broker = RedisBroker(
            url=settings.redis_url.get_secret_value(),
            namespace="devpulse",
            middleware=[AgeLimit(), TimeLimit(), Retries(max_retries=0)],
        )
        self.actor = dramatiq.actor(
            self.execute,
            actor_name="devpulse_diagnostic",
            queue_name="devpulse_infrastructure",
            broker=self.broker,
            time_limit=10000,
            max_age=120000,
            max_retries=0,
        )

    def execute(self, job_id):
        job_id = uuid.UUID(job_id)
        fence = uuid.uuid4()
        with self.sessions.begin() as db:
            job = db.scalar(select(Job).where(Job.id == job_id).with_for_update())
            if not job or job.status != "queued" or job.cancel_requested:
                return
            if job.attempt_count >= 3:
                transition(job, "failed")
                job.error_category = "attempts_exhausted"
                return
            if job.job_type != "diagnostic":
                transition(job, "failed")
                job.error_category = "unsupported_job"
                return
            transition(job, "running")
            job.attempt_count += 1
            job.lease_token, job.lease_until = fence, now() + timedelta(seconds=30)
            job.progress, job.stage = 25, "database_connected"
        try:
            # Actual infrastructure checks, never repository analysis or simulated AI work.
            self.redis.ping()
            with self.sessions.begin() as db:
                job = db.scalar(select(Job).where(Job.id == job_id).with_for_update())
                if job.status != "running" or job.lease_token != fence:
                    return
                job.progress, job.stage = 70, "redis_connected"
                if not db.scalar(
                    text("SELECT extversion FROM pg_extension WHERE extname = 'vector'")
                ):
                    raise RuntimeError("Missing vector extension")
            with self.sessions.begin() as db:
                job = db.scalar(select(Job).where(Job.id == job_id).with_for_update())
                if job.status != "running" or job.lease_token != fence:
                    return
                transition(job, "completed")
                job.stage, job.error_category = "infrastructure_verified", None
        except Exception:
            self.fail_attempt(job_id, fence)

    def fail_attempt(self, job_id, fence):
        with self.sessions.begin() as db:
            job = db.scalar(select(Job).where(Job.id == job_id).with_for_update())
            if job and job.status == "running" and job.lease_token == fence:
                self.retry(job, "dependency_failure")

    @staticmethod
    def retry(job, category):
        transition(job, "failed" if job.attempt_count >= 3 else "queued")
        job.error_category = category
        job.stage = "failed" if job.status == "failed" else "retry_wait"
        job.lease_until, job.lease_token = None, None
        job.next_dispatch_at = now() + timedelta(seconds=2**job.attempt_count)

    def dispatch(self):
        with self.sessions.begin() as db:
            rows = db.scalars(
                select(Job)
                .where(
                    or_(
                        (Job.status == "queued") & (Job.next_dispatch_at <= now()),
                        (Job.status == "running") & (Job.lease_until < now()),
                    )
                )
                .order_by(Job.created_at)
                .with_for_update(skip_locked=True)
                .limit(50)
            ).all()
            for job in rows:
                if job.status == "running":
                    self.retry(job, "worker_lease_expired")
                    continue
                if job.created_at < now() - timedelta(minutes=5):
                    transition(job, "failed")
                    job.stage, job.error_category = "failed", "queue_timeout"
                    continue
                self.actor.send(str(job.id))
                # Republish if acknowledgement/Redis state was lost. Claims are idempotent.
                job.next_dispatch_at = now() + timedelta(seconds=30)

    def close(self):
        self.broker.close()
        self.redis.close()
        self.engine.dispose()


def main():
    runtime = Runtime(get_settings())
    stop = threading.Event()
    signal.signal(signal.SIGTERM, lambda *_: stop.set())
    signal.signal(signal.SIGINT, lambda *_: stop.set())
    worker = dramatiq.Worker(runtime.broker, worker_threads=2)
    worker.start()
    try:
        while not stop.is_set():
            try:
                runtime.dispatch()
                if all(thread.is_alive() for thread in worker.workers):
                    runtime.redis.set("devpulse:worker:heartbeat", "alive", ex=15)
            except Exception:
                logging.getLogger("devpulse").warning('{"event":"worker_dependency_unavailable"}')
            stop.wait(2)
    finally:
        worker.stop(timeout=15000)
        runtime.close()


if __name__ == "__main__":
    main()
