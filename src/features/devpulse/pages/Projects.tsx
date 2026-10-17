import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  FolderGit2,
  LockKeyhole,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { api, ApiError } from "../api/client";
import type { ProjectInput, ProjectPage } from "../api/contracts";
import SessionGate from "../components/live/SessionGate";
import ProjectForm from "../components/live/ProjectForm";
import JobHistory from "../components/live/JobHistory";
import { ErrorNotice, Loading, useRequest } from "../components/live/shared";
import "../projects.css";
function ProjectList({ expire }: { expire: () => void }) {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const offset = Math.max(
    0,
    Math.min(10000, Number(params.get("offset")) || 0),
  );
  const request = useRequest<ProjectPage>(
    (signal) => api.projects(search, offset, signal),
    [search, offset],
  );
  useEffect(() => {
    if (request.error instanceof ApiError && request.error.status === 401)
      expire();
  }, [request.error, expire]);
  return (
    <>
      <header className="dp-live-heading">
        <div>
          <span className="dp-eyebrow">01 / PROJECT LIBRARY</span>
          <h1>
            Your projects<span>.</span>
          </h1>
          <p>A clear starting point for every codebase.</p>
        </div>
        <Link className="dp-button dp-primary" to="/devpulse/projects/new">
          <Plus size={17} /> New project
        </Link>
      </header>
      <div className="dp-live-toolbar">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setParams({ search: String(data.get("search") ?? "") });
          }}
        >
          <Search size={17} />
          <input
            key={search}
            name="search"
            aria-label="Search projects"
            defaultValue={search}
            maxLength={100}
            placeholder="Find a project…"
          />
          <button type="submit">Search</button>
        </form>
        <span>
          {request.data ? `${request.data.total} projects` : "Private library"}
        </span>
        <button
          className="dp-icon-button"
          aria-label="Refresh projects"
          onClick={request.refresh}
        >
          <RefreshCw size={16} />
        </button>
      </div>
      <ErrorNotice error={request.error} />
      {request.loading ? (
        <Loading>Retrieving projects…</Loading>
      ) : (
        request.data && (
          <>
            {request.data.items.length === 0 ? (
              <div className="dp-project-empty">
                <FolderGit2 size={36} strokeWidth={1} />
                <h2>
                  {search
                    ? "No matching projects."
                    : "Every system starts somewhere."}
                </h2>
                <p>
                  {search
                    ? "Try a different name or clear your search."
                    : "Create your first private project. Add its purpose and a repository reference when you’re ready."}
                </p>
                {search ? (
                  <button
                    className="dp-button dp-secondary"
                    onClick={() => setParams({})}
                  >
                    Clear search
                  </button>
                ) : (
                  <Link
                    className="dp-button dp-primary"
                    to="/devpulse/projects/new"
                  >
                    Create your first project <Plus size={16} />
                  </Link>
                )}
              </div>
            ) : (
              <div className="dp-project-list">
                {request.data.items.map((project, index) => (
                  <Link
                    key={project.id}
                    className="dp-project-row"
                    to={`/devpulse/projects/${project.id}`}
                  >
                    <span className="dp-project-index">
                      {String(offset + index + 1).padStart(2, "0")}
                    </span>
                    <span className="dp-project-monogram">
                      {project.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <h2>{project.name}</h2>
                      <p>{project.description || "No description yet"}</p>
                      <small>
                        {project.source_type === "github"
                          ? "GitHub reference"
                          : "Project foundation"}{" "}
                        · Created{" "}
                        {new Date(project.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <span className="dp-private-tag">
                      <LockKeyhole size={12} /> Private
                    </span>
                    <ArrowRight size={19} />
                  </Link>
                ))}
              </div>
            )}
            {request.data.total > 12 && (
              <nav className="dp-pagination" aria-label="Project pages">
                <button
                  className="dp-button dp-secondary"
                  disabled={offset === 0}
                  onClick={() =>
                    setParams({
                      search,
                      offset: String(Math.max(0, offset - 12)),
                    })
                  }
                >
                  Previous
                </button>
                <span>
                  {offset + 1}–{Math.min(offset + 12, request.data.total)} of{" "}
                  {request.data.total}
                </span>
                <button
                  className="dp-button dp-secondary"
                  disabled={
                    offset + 12 >= request.data.total || offset + 12 > 10000
                  }
                  onClick={() =>
                    setParams({ search, offset: String(offset + 12) })
                  }
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )
      )}
      <div className="dp-phase-note">
        <ShieldCheck size={23} />
        <div>
          <strong>Foundations first. Intelligence next.</strong>
          <p>
            Projects and infrastructure diagnostics are live. Repository import,
            code analysis and AI assistance are planned for subsequent phases.
          </p>
        </div>
        <span>PHASE 02</span>
      </div>
    </>
  );
}

function NewProject({ expire }: { expire: () => void }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const submit = async (data: ProjectInput) => {
    setBusy(true);
    setError(undefined);
    try {
      const project = await api.create(data);
      navigate(`/devpulse/projects/${project.id}`, { replace: true });
    } catch (error) {
      setError(error);
      if (error instanceof ApiError && error.status === 401) expire();
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Link className="dp-live-back" to="/devpulse/projects">
        <ArrowLeft size={15} /> Projects
      </Link>
      <header className="dp-live-heading">
        <div>
          <span className="dp-eyebrow">NEW / PRIVATE PROJECT</span>
          <h1>
            Start with intent<span>.</span>
          </h1>
          <p>A name, a purpose, and a place to build understanding.</p>
        </div>
      </header>
      <div className="dp-create-layout">
        <div>
          <ErrorNotice error={error} />
          <ProjectForm onSubmit={submit} busy={busy} />
        </div>
        <aside className="dp-project-aside">
          <Database size={28} strokeWidth={1} />
          <h2>A persistent foundation.</h2>
          <p>
            Your project is stored privately and stays with you across sessions.
          </p>
          <ol>
            <li>Name the project</li>
            <li>Add a repository reference, if useful</li>
            <li>Verify the infrastructure</li>
          </ol>
          <small>
            Repository ingestion is not available yet. Creating a project does
            not run analysis.
          </small>
        </aside>
      </div>
    </>
  );
}

function ProjectDetail({ expire }: { expire: () => void }) {
  const { projectId = "" } = useParams();
  const request = useRequest(
    (signal) => api.project(projectId, signal),
    [projectId],
  );
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (request.error instanceof ApiError && request.error.status === 401)
      expire();
  }, [request.error, expire]);
  const save = async (data: ProjectInput) => {
    setBusy(true);
    setError(undefined);
    try {
      await api.update(projectId, {
        name: data.name,
        description: data.description,
        default_branch: data.default_branch,
      });
      setEdit(false);
      setSaved(true);
      request.refresh();
    } catch (error) {
      setError(error);
      if (error instanceof ApiError && error.status === 401) expire();
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await api.remove(projectId);
      navigate("/devpulse/projects", { replace: true });
    } catch (error) {
      setError(error);
      if (error instanceof ApiError && error.status === 401) expire();
    } finally {
      setBusy(false);
    }
  };
  const project = request.data;
  return (
    <>
      <Link className="dp-live-back" to="/devpulse/projects">
        <ArrowLeft size={15} /> Projects
      </Link>
      {request.loading ? (
        <Loading />
      ) : request.error ? (
        <>
          <ErrorNotice error={request.error} />
          <button className="dp-button dp-secondary" onClick={request.refresh}>
            Retry
          </button>
        </>
      ) : (
        project && (
          <>
            <header className="dp-live-heading">
              <div>
                <span className="dp-eyebrow">PROJECT / PRIVATE</span>
                <h1>
                  {project.name}
                  <span>.</span>
                </h1>
                <p>
                  {project.description ||
                    "Add a description to capture this project’s purpose."}
                </p>
              </div>
              <button
                className="dp-button dp-secondary"
                onClick={() => {
                  setEdit(!edit);
                  setError(undefined);
                  setSaved(false);
                }}
              >
                {edit ? "Close editor" : "Edit project"}
              </button>
            </header>
            {saved && (
              <p role="status" className="dp-save-status">
                <Check size={15} /> Project changes saved.
              </p>
            )}
            <ErrorNotice error={error} />
            {edit && (
              <div className="dp-edit-panel">
                <ProjectForm project={project} onSubmit={save} busy={busy} />
              </div>
            )}
            <div className="dp-project-facts">
              <div>
                <span>REPOSITORY</span>
                {project.repository_url ? (
                  <a
                    href={project.repository_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.repository_url.replace("https://github.com/", "")}
                  </a>
                ) : (
                  <strong>No repository reference</strong>
                )}
              </div>
              <div>
                <span>DEFAULT BRANCH</span>
                <strong>{project.default_branch || "Not specified"}</strong>
              </div>
              <div>
                <span>ANALYSIS</span>
                <strong>Not available yet</strong>
              </div>
              <div>
                <span>CREATED</span>
                <strong>
                  {new Date(project.created_at).toLocaleDateString()}
                </strong>
              </div>
            </div>
            <JobHistory projectId={projectId} expire={expire} />
            <section className="dp-delete-section">
              <div>
                <h2>Delete project</h2>
                <p>
                  Remove it from your workspace and cancel active infrastructure
                  jobs. A deletion record is retained.
                </p>
              </div>
              {!confirm ? (
                <button
                  className="dp-button dp-secondary"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 size={15} /> Delete project
                </button>
              ) : (
                <div className="dp-delete-confirm">
                  <p>
                    Delete “{project.name}”? This cannot be undone from the app.
                  </p>
                  <button
                    disabled={busy}
                    className="dp-button dp-danger"
                    onClick={() => void remove()}
                  >
                    Confirm deletion
                  </button>
                  <button
                    className="dp-button dp-secondary"
                    onClick={() => setConfirm(false)}
                  >
                    Keep project
                  </button>
                </div>
              )}
            </section>
          </>
        )
      )}
    </>
  );
}

export default function Projects() {
  return (
    <SessionGate>
      {(_me, expire) => (
        <Routes>
          <Route index element={<ProjectList expire={expire} />} />
          <Route path="new" element={<NewProject expire={expire} />} />
          <Route
            path=":projectId"
            element={<ProjectDetail expire={expire} />}
          />
          <Route
            path="*"
            element={
              <div className="dp-empty">
                <h1>Project page not found.</h1>
                <Link to="/devpulse/projects">Back to projects</Link>
              </div>
            }
          />
        </Routes>
      )}
    </SessionGate>
  );
}
