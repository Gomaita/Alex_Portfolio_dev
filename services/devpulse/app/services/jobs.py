from app.core.errors import APIError
from app.db.models import now

TRANSITIONS = {
    "queued": {"running", "cancelled", "failed"},
    "running": {"completed", "failed", "cancelled", "queued"},
    "completed": set(),
    "failed": set(),
    "cancelled": set(),
}


def transition(job, target):
    if target not in TRANSITIONS[job.status]:
        raise APIError(409, "invalid_transition", "Job is already in a terminal state.")
    job.status = target
    if target in {"completed", "failed", "cancelled"}:
        job.completed_at = now()
        job.lease_until = None
        job.lease_token = None
    if target == "completed":
        job.progress = 100
    if target == "running":
        job.started_at = job.started_at or now()


def cancel(job):
    if job.status in {"queued", "running"}:
        job.cancel_requested = True
        # Diagnostic has no external effects. Revoking its lease fences a concurrent finish.
        transition(job, "cancelled")
        job.stage = "cancelled"
