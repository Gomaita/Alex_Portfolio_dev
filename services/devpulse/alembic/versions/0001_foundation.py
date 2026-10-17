"""Initial frozen PostgreSQL schema, independent of future ORM edits."""

from pathlib import Path

from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    sql = Path(__file__).with_name("0001_schema.sql").read_text(encoding="utf-8")
    for statement in sql.split(";"):
        if statement.strip():
            op.execute(statement)


def downgrade():
    for table in [
        "analysis_runs",
        "project_memberships",
        "audit_events",
        "analysis_jobs",
        "sessions",
        "projects",
        "users",
        "login_attempts",
    ]:
        op.drop_table(table)
    # Extension may be shared with other applications; intentionally retain it.
