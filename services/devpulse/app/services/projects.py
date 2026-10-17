from sqlalchemy import select

from app.core.errors import APIError
from app.db.models import AuditEvent, Project


def owned_project(db, user_id, project_id, lock=False):
    # Applied in every API operation, including jobs. Members are reserved for a future phase;
    # membership records do not silently grant access before a collaboration policy exists.
    query = select(Project).where(
        Project.id == project_id, Project.owner_id == user_id, Project.deleted_at.is_(None)
    )
    if lock:
        query = query.with_for_update()
    project = db.scalar(query)
    if project is None:
        raise APIError(404, "not_found", "Project not found.")
    return project


def audit(db, actor_id, project_id, action, request_id):
    db.add(
        AuditEvent(actor_id=actor_id, project_id=project_id, action=action, request_id=request_id)
    )
