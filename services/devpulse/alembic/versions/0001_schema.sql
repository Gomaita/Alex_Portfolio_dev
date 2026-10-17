CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE login_attempts (
	state_hash VARCHAR(64) NOT NULL, 
	browser_hash VARCHAR(64) NOT NULL, 
	verifier VARCHAR(128) NOT NULL, 
	nonce VARCHAR(128) NOT NULL, 
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (state_hash)
);

CREATE INDEX ix_login_attempts_expires_at ON login_attempts (expires_at);

CREATE TABLE users (
	issuer VARCHAR(500) NOT NULL, 
	subject VARCHAR(255) NOT NULL, 
	display_name VARCHAR(160) NOT NULL, 
	email VARCHAR(320), 
	status VARCHAR(20) NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (issuer, subject), 
	CHECK (status IN ('active', 'disabled'))
);

CREATE TABLE projects (
	owner_id UUID NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT NOT NULL, 
	visibility VARCHAR(20) NOT NULL, 
	source_type VARCHAR(20) NOT NULL, 
	repository_url VARCHAR(500), 
	default_branch VARCHAR(100), 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	deleted_at TIMESTAMP WITH TIME ZONE, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CHECK (visibility = 'private'), 
	CHECK (source_type IN ('manual', 'github')), 
	CHECK ((source_type = 'github') = (repository_url IS NOT NULL)), 
	FOREIGN KEY(owner_id) REFERENCES users (id)
);

CREATE INDEX ix_projects_owner_created ON projects (owner_id, created_at, id);

CREATE TABLE sessions (
	token_hash VARCHAR(64) NOT NULL, 
	user_id UUID NOT NULL, 
	csrf_hash VARCHAR(64) NOT NULL, 
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (token_hash), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX ix_sessions_expires_at ON sessions (expires_at);

CREATE INDEX ix_sessions_user_id ON sessions (user_id);

CREATE TABLE analysis_jobs (
	project_id UUID NOT NULL, 
	job_type VARCHAR(32) NOT NULL, 
	idempotency_key VARCHAR(64) NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	progress INTEGER NOT NULL, 
	stage VARCHAR(60) NOT NULL, 
	error_category VARCHAR(40), 
	attempt_count INTEGER NOT NULL, 
	cancel_requested BOOLEAN NOT NULL, 
	started_at TIMESTAMP WITH TIME ZONE, 
	completed_at TIMESTAMP WITH TIME ZONE, 
	lease_until TIMESTAMP WITH TIME ZONE, 
	lease_token UUID, 
	next_dispatch_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (project_id, idempotency_key), 
	CHECK (job_type = 'diagnostic'), 
	CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')), 
	CHECK (progress BETWEEN 0 AND 100), 
	CHECK (attempt_count BETWEEN 0 AND 3), 
	FOREIGN KEY(project_id) REFERENCES projects (id)
);

CREATE INDEX ix_analysis_jobs_next_dispatch_at ON analysis_jobs (next_dispatch_at);

CREATE INDEX ix_analysis_jobs_status ON analysis_jobs (status);

CREATE INDEX ix_jobs_project_created ON analysis_jobs (project_id, created_at, id);

CREATE TABLE audit_events (
	actor_id UUID NOT NULL, 
	project_id UUID, 
	action VARCHAR(50) NOT NULL, 
	request_id VARCHAR(36) NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(actor_id) REFERENCES users (id), 
	FOREIGN KEY(project_id) REFERENCES projects (id)
);

CREATE INDEX ix_audit_events_actor_id ON audit_events (actor_id);

CREATE INDEX ix_audit_events_project_id ON audit_events (project_id);

CREATE TABLE project_memberships (
	project_id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	role VARCHAR(20) NOT NULL, 
	PRIMARY KEY (project_id, user_id), 
	CHECK (role IN ('owner', 'editor', 'viewer')), 
	FOREIGN KEY(project_id) REFERENCES projects (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE analysis_runs (
	project_id UUID NOT NULL, 
	job_id UUID, 
	source_revision VARCHAR(64), 
	pipeline_version VARCHAR(80) NOT NULL, 
	started_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	completed_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	details JSONB NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CHECK (status IN ('completed', 'failed', 'partial')), 
	FOREIGN KEY(project_id) REFERENCES projects (id), 
	UNIQUE (job_id), 
	FOREIGN KEY(job_id) REFERENCES analysis_jobs (id)
);

CREATE INDEX ix_analysis_runs_project_id ON analysis_runs (project_id);
