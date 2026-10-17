import uuid

from fastapi import APIRouter, Depends, Header, Query, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.core.errors import APIError
from app.core.security import Identity, identity, mutation, rate_limit
from app.db.models import Job, Membership, Project, now
from app.db.session import get_db
from app.schemas.contracts import (
    JobInput,
    JobPage,
    JobView,
    Me,
    ProjectInput,
    ProjectPage,
    ProjectPatch,
    ProjectView,
)
from app.services.jobs import cancel
from app.services.projects import audit, owned_project

router = APIRouter(prefix="/api/v1")


@router.get("/health", tags=["operations"])
def health():
    return {"status": "ok", "service": "devpulse", "version": "0.2.0"}


@router.get("/ready", tags=["operations"])
def ready(request: Request, db: Session = Depends(get_db)):
    try:
        version = db.scalar(text("SELECT version_num FROM alembic_version"))
        vector = db.scalar(text("SELECT extversion FROM pg_extension WHERE extname = 'vector'"))
        request.app.state.redis.ping()
        if (
            version != "0001"
            or not vector
            or not request.app.state.redis.get("devpulse:worker:heartbeat")
        ):
            raise ValueError("Not ready")
    except Exception as exc:
        raise APIError(503, "not_ready", "Service is not ready.", True) from exc
    return {"status": "ready"}


@router.get("/auth/login", tags=["authentication"])
def login(request: Request, db: Session = Depends(get_db)):
    # Direct peer address only; never trust arbitrary forwarded headers.
    rate_limit(request, f"login:{request.client.host if request.client else 'unknown'}", 10)
    try:
        url, browser = request.app.state.oidc.begin(db)
    except APIError:
        raise
    except Exception as exc:
        raise APIError(
            503, "identity_unavailable", "Identity provider is unavailable.", True
        ) from exc
    response = RedirectResponse(url, status_code=303)
    response.set_cookie(
        "devpulse_login",
        browser,
        max_age=300,
        httponly=True,
        secure=request.app.state.settings.secure_cookie,
        samesite="lax",
        path="/api/v1/auth",
    )
    return response


@router.get("/auth/callback", tags=["authentication"])
def callback(
    request: Request,
    state: str = Query(max_length=128),
    code: str = Query(max_length=4096),
    db: Session = Depends(get_db),
):
    settings = request.app.state.settings
    try:
        token = request.app.state.oidc.finish(
            db, state, request.cookies.get("devpulse_login", ""), code
        )
    except Exception:
        db.rollback()
        response = RedirectResponse(
            settings.frontend_origin + "/devpulse/projects?auth=failed", 303
        )
    else:
        response = RedirectResponse(settings.frontend_origin + "/devpulse/projects", 303)
        response.set_cookie(
            settings.cookie_name,
            token,
            max_age=settings.session_hours * 3600,
            httponly=True,
            secure=settings.secure_cookie,
            samesite="lax",
            path="/",
        )
    response.delete_cookie("devpulse_login", path="/api/v1/auth")
    return response


@router.get("/me", response_model=Me, tags=["authentication"])
def me(auth: Identity = Depends(identity)):
    return Me(
        id=auth.user.id,
        display_name=auth.user.display_name,
        csrf_token=auth.csrf,
        expires_at=auth.session.expires_at,
    )


@router.post("/auth/logout", status_code=204, tags=["authentication"])
def logout(request: Request, auth: Identity = Depends(mutation), db: Session = Depends(get_db)):
    db.delete(auth.session)
    audit(db, auth.user.id, None, "session.logout", request.state.request_id)
    db.commit()
    response = Response(status_code=204)
    response.delete_cookie(
        request.app.state.settings.cookie_name,
        path="/",
        secure=request.app.state.settings.secure_cookie,
        httponly=True,
        samesite="lax",
    )
    return response


@router.get("/projects", response_model=ProjectPage, tags=["projects"])
def projects(
    auth: Identity = Depends(identity),
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0, le=10000),
    search: str = Query("", max_length=100),
):
    where = [Project.owner_id == auth.user.id, Project.deleted_at.is_(None)]
    if search.strip():
        where.append(Project.name.icontains(search.strip(), autoescape=True))
    rows = db.scalars(
        select(Project)
        .where(*where)
        .order_by(Project.created_at.desc(), Project.id.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    total = db.scalar(select(func.count()).select_from(Project).where(*where))
    return {"items": rows, "total": total, "limit": limit, "offset": offset}


@router.post("/projects", response_model=ProjectView, status_code=201, tags=["projects"])
def create_project(
    data: ProjectInput,
    request: Request,
    response: Response,
    auth: Identity = Depends(mutation),
    db: Session = Depends(get_db),
):
    project = Project(owner_id=auth.user.id, **data.model_dump())
    db.add(project)
    db.flush()
    db.add(Membership(project_id=project.id, user_id=auth.user.id, role="owner"))
    audit(db, auth.user.id, project.id, "project.created", request.state.request_id)
    db.commit()
    response.headers["Location"] = f"/api/v1/projects/{project.id}"
    return project


@router.get("/projects/{project_id}", response_model=ProjectView, tags=["projects"])
def project(
    project_id: uuid.UUID, auth: Identity = Depends(identity), db: Session = Depends(get_db)
):
    return owned_project(db, auth.user.id, project_id)


@router.patch("/projects/{project_id}", response_model=ProjectView, tags=["projects"])
def update_project(
    project_id: uuid.UUID,
    data: ProjectPatch,
    request: Request,
    auth: Identity = Depends(mutation),
    db: Session = Depends(get_db),
):
    row = owned_project(db, auth.user.id, project_id, lock=True)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    audit(db, auth.user.id, row.id, "project.updated", request.state.request_id)
    db.commit()
    return row


@router.delete("/projects/{project_id}", status_code=204, tags=["projects"])
def delete_project(
    project_id: uuid.UUID,
    request: Request,
    auth: Identity = Depends(mutation),
    db: Session = Depends(get_db),
):
    row = owned_project(db, auth.user.id, project_id, lock=True)
    row.deleted_at = now()
    for job in db.scalars(
        select(Job)
        .where(Job.project_id == row.id, Job.status.in_(["queued", "running"]))
        .with_for_update()
    ):
        cancel(job)
    audit(db, auth.user.id, row.id, "project.deleted", request.state.request_id)
    db.commit()
    return Response(status_code=204)


@router.post("/projects/{project_id}/jobs", response_model=JobView, status_code=202, tags=["jobs"])
def create_job(
    project_id: uuid.UUID,
    data: JobInput,
    request: Request,
    response: Response,
    idempotency_key: str = Header(min_length=16, max_length=64, pattern=r"^[a-zA-Z0-9_-]+$"),
    auth: Identity = Depends(mutation),
    db: Session = Depends(get_db),
):
    owned_project(db, auth.user.id, project_id, lock=True)
    existing = db.scalar(
        select(Job).where(Job.project_id == project_id, Job.idempotency_key == idempotency_key)
    )
    if existing:
        return existing
    rate_limit(request, f"diagnostic:{auth.user.id}", request.app.state.settings.diagnostic_limit)
    active = db.scalar(
        select(func.count())
        .select_from(Job)
        .where(Job.project_id == project_id, Job.status.in_(["queued", "running"]))
    )
    if active >= 2:
        raise APIError(409, "jobs_active", "Wait for existing jobs to finish.")
    job = Job(project_id=project_id, idempotency_key=idempotency_key, job_type=data.job_type)
    db.add(job)
    audit(db, auth.user.id, project_id, "diagnostic.queued", request.state.request_id)
    # Job row is also its durable dispatch ledger; Redis outage cannot lose it.
    db.commit()
    response.headers["Location"] = f"/api/v1/projects/{project_id}/jobs/{job.id}"
    return job


@router.get("/projects/{project_id}/jobs", response_model=JobPage, tags=["jobs"])
def jobs(
    project_id: uuid.UUID,
    auth: Identity = Depends(identity),
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0, le=10000),
):
    owned_project(db, auth.user.id, project_id)
    where = Job.project_id == project_id
    return {
        "items": db.scalars(
            select(Job)
            .where(where)
            .order_by(Job.created_at.desc(), Job.id.desc())
            .limit(limit)
            .offset(offset)
        ).all(),
        "total": db.scalar(select(func.count()).select_from(Job).where(where)),
        "limit": limit,
        "offset": offset,
    }


def get_job(db, project_id, job_id, lock=False):
    query = select(Job).where(Job.id == job_id, Job.project_id == project_id)
    row = db.scalar(query.with_for_update() if lock else query)
    if row is None:
        raise APIError(404, "not_found", "Job not found.")
    return row


@router.get("/projects/{project_id}/jobs/{job_id}", response_model=JobView, tags=["jobs"])
def job_detail(
    project_id: uuid.UUID,
    job_id: uuid.UUID,
    auth: Identity = Depends(identity),
    db: Session = Depends(get_db),
):
    owned_project(db, auth.user.id, project_id)
    return get_job(db, project_id, job_id)


@router.post("/projects/{project_id}/jobs/{job_id}/cancel", response_model=JobView, tags=["jobs"])
def cancel_job(
    project_id: uuid.UUID,
    job_id: uuid.UUID,
    request: Request,
    auth: Identity = Depends(mutation),
    db: Session = Depends(get_db),
):
    owned_project(db, auth.user.id, project_id, lock=True)
    row = get_job(db, project_id, job_id, lock=True)
    if row.status in {"queued", "running"}:
        cancel(row)
        audit(db, auth.user.id, project_id, "diagnostic.cancelled", request.state.request_id)
    db.commit()
    return row
