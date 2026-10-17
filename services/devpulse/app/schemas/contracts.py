import re
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ProjectInput(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=2000)
    source_type: Literal["manual", "github"] = "manual"
    repository_url: str | None = Field(default=None, max_length=500)
    default_branch: str | None = Field(default=None, max_length=100)

    @field_validator("repository_url")
    @classmethod
    def github_url(cls, value):
        if value is not None and not re.fullmatch(
            r"https://github\.com/[A-Za-z0-9][A-Za-z0-9-]{0,38}/[A-Za-z0-9_.-]{1,100}", value
        ):
            raise ValueError("Use https://github.com/owner/repository without query or credentials")
        if value and value.rsplit("/", 1)[1] in {".", ".."}:
            raise ValueError("Invalid repository name")
        return value

    @model_validator(mode="after")
    def consistent_source(self):
        if (self.source_type == "github") != bool(self.repository_url):
            raise ValueError("GitHub projects require a repository URL; manual projects omit it")
        return self


class ProjectPatch(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=2000)
    default_branch: str | None = Field(default=None, max_length=100)

    @model_validator(mode="after")
    def no_null_required(self):
        for field in ("name", "description"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")
        if not self.model_fields_set:
            raise ValueError("At least one editable field is required")
        return self


class ProjectView(ProjectInput):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    visibility: Literal["private"]
    created_at: datetime
    updated_at: datetime


class ProjectPage(BaseModel):
    items: list[ProjectView]
    total: int
    limit: int
    offset: int


class JobInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    job_type: Literal["diagnostic"] = "diagnostic"


class JobView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    project_id: UUID
    job_type: Literal["diagnostic"]
    status: Literal["queued", "running", "completed", "failed", "cancelled"]
    progress: int
    stage: str
    error_category: str | None
    attempt_count: int
    cancel_requested: bool
    created_at: datetime
    started_at: datetime | None
    completed_at: datetime | None


class JobPage(BaseModel):
    items: list[JobView]
    total: int
    limit: int
    offset: int


class Me(BaseModel):
    id: UUID
    display_name: str
    csrf_token: str
    expires_at: datetime
