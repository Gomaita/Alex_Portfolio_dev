import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import type { ProjectInput, ProjectView } from "../../api/contracts";
export default function ProjectForm({
  project,
  onSubmit,
  busy,
}: {
  project?: ProjectView;
  onSubmit: (data: ProjectInput) => Promise<void>;
  busy: boolean;
}) {
  const [source, setSource] = useState<"manual" | "github">(
    project?.source_type ?? "manual",
  );
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    void onSubmit({
      name: String(fields.get("name")).trim(),
      description: String(fields.get("description")).trim(),
      source_type: source,
      repository_url:
        source === "github"
          ? String(
              fields.get("repository_url") ?? project?.repository_url,
            ).trim()
          : null,
      default_branch: String(fields.get("default_branch") ?? "").trim() || null,
    });
  };
  return (
    <form className="dp-project-form" onSubmit={submit}>
      <label>
        Project name
        <input
          name="name"
          autoComplete="off"
          required
          maxLength={100}
          defaultValue={project?.name}
          placeholder="e.g. Dispatch API"
        />
      </label>
      <label>
        Description <span>Optional</span>
        <textarea
          name="description"
          maxLength={2000}
          rows={4}
          defaultValue={project?.description}
          placeholder="What are you building?"
        />
      </label>
      {!project && (
        <label>
          Project source
          <select
            value={source}
            onChange={(event) => setSource(event.target.value as typeof source)}
          >
            <option value="manual">Project only</option>
            <option value="github">GitHub repository reference</option>
          </select>
        </label>
      )}
      {source === "github" && !project && (
        <label>
          Repository URL
          <input
            name="repository_url"
            type="url"
            required
            maxLength={500}
            pattern="https://github\.com/[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9_.-]+"
            placeholder="https://github.com/owner/repository"
          />
          <small>
            Stores the reference only. No repository is downloaded or analyzed.
          </small>
        </label>
      )}
      <label>
        Default branch <span>Optional</span>
        <input
          name="default_branch"
          maxLength={100}
          defaultValue={project?.default_branch ?? ""}
          placeholder="main"
        />
      </label>
      <div className="dp-form-footer">
        <span>
          <LockKeyhole size={14} /> Only you can access this project
        </span>
        <button disabled={busy} className="dp-button dp-primary" type="submit">
          {busy ? "Saving…" : project ? "Save changes" : "Create project"}
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
