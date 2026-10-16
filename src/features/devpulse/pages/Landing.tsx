import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  GitBranch,
  Braces,
  ScanLine,
} from "lucide-react";
import HeroGraph from "../components/HeroGraph";
import { Reveal } from "../motion";
import { metrics } from "../data/repository";

export default function Landing() {
  return (
    <>
      <section className="dp-hero dp-container">
        <Reveal>
          <p className="dp-eyebrow">
            <span className="dp-dot" /> SOFTWARE INTELLIGENCE, WITH EVIDENCE.
          </p>
        </Reveal>
        <div className="dp-hero-heading">
          <Reveal>
            <h1 tabIndex={-1}>
              Understand your code.
              <br />
              <span>Improve what matters.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="dp-hero-aside">
              See the structure.
              <br />
              Follow the evidence.
              <br />
              <span>Keep the decisions yours.</span>
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="dp-hero-bottom">
          <p>
            A clearer view of how software fits together.
            <br />
            Explore a real source fixture, one relationship at a time.
          </p>
          <div className="dp-actions">
            <Link className="dp-button dp-primary" to="/devpulse/explore">
              Explore the sample <ArrowRight size={17} />
            </Link>
            <Link
              className="dp-button dp-secondary"
              to="/devpulse/explore/architecture"
            >
              Open architecture <ArrowUpRight size={17} />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <HeroGraph />
        </Reveal>
        <div className="dp-proof-strip">
          <span>
            <b>01</b> FIRST-PARTY SAMPLE
          </span>
          <span>{metrics.files} source modules</span>
          <span>{metrics.imports} evidenced imports</span>
          <span>No account. No API key.</span>
        </div>
      </section>
      <section
        className="dp-editorial dp-container"
        aria-labelledby="structure-title"
      >
        <Reveal className="dp-section-intro">
          <span className="dp-eyebrow">01 / REPOSITORY INTELLIGENCE</span>
          <h2 id="structure-title">
            The code is familiar.
            <br />
            <span>The whole picture isn’t.</span>
          </h2>
          <p>
            Move beyond a directory tree. See where a request enters, where
            decisions live, and which modules depend on each other.
          </p>
          <Link className="dp-text-link" to="/devpulse/explore">
            Get to know Dispatch <ArrowRight size={17} />
          </Link>
        </Reveal>
        <Reveal className="dp-boundary-diagram">
          <div className="dp-diagram-head">
            <GitBranch size={19} />
            <span>EXPLICIT BOUNDARIES</span>
            <span className="dp-tag">Available now</span>
          </div>
          {[
            ["01", "Transport", "api/router.ts", "Commands enter here."],
            [
              "02",
              "Service",
              "services/taskService.ts",
              "Validation meets orchestration.",
            ],
            ["03", "Domain", "domain/task.ts", "State changes stay explicit."],
          ].map(([n, title, path, description]) => (
            <Link
              key={n}
              to={`/devpulse/explore/architecture?file=${encodeURIComponent(path)}`}
              className="dp-boundary-row"
            >
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <code>{path}</code>
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <p className="dp-fine">
            A structural import map of the bundled sample. Not a runtime trace.
          </p>
        </Reveal>
      </section>
      <section className="dp-evidence-section">
        <div className="dp-container">
          <Reveal>
            <div className="dp-section-heading">
              <span className="dp-eyebrow">02 / ARCHITECTURE EXPLORATION</span>
              <span className="dp-tag">Working in this release</span>
            </div>
            <h2>
              Every connection
              <br />
              has a <em>source.</em>
            </h2>
          </Reveal>
          <div className="dp-evidence-grid">
            <Reveal>
              <div className="dp-evidence-example">
                <div>
                  <Braces size={18} />
                  <span>services/taskService.ts</span>
                  <span>L1</span>
                </div>
                <code>
                  <span>import</span> {"{ completeTask, type Task }"}
                  <br />
                  <span>from</span> <b>'../domain/task'</b>
                </code>
                <div className="dp-evidence-target">
                  <GitBranch size={16} />
                  <span>domain/task.ts</span>
                  <span>Source-backed edge</span>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <h3>From overview to the exact line.</h3>
              <p>
                Select a module. Separate its imports from its dependents. Open
                the source and inspect the declarations behind the diagram.
              </p>
              <p className="dp-fine">
                Relationships and symbol ranges are generated from the
                TypeScript syntax tree. The fixture is content-hashed and
                checked against its source files.
              </p>
              <Link
                className="dp-text-link"
                to="/devpulse/explore/architecture?file=services%2FtaskService.ts"
              >
                Trace a relationship <ArrowRight size={17} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="dp-roadmap dp-container">
        <Reveal>
          <span className="dp-eyebrow">03 / THE DIRECTION</span>
          <h2>
            Intelligence that earns
            <br />
            <span>your confidence.</span>
          </h2>
          <p className="dp-roadmap-intro">
            Architecture exploration is the foundation. These capabilities are
            planned, and are not active in this release.
          </p>
        </Reveal>
        <div className="dp-future-list">
          {[
            [
              "01",
              "Evidence-grounded analysis",
              "Static tool observations first. AI interpretation second. Every claim attributed, every limitation visible.",
              "PHASES 3–5",
            ],
            [
              "02",
              "Human-reviewed improvements",
              "Proposed patches with readable diffs, explicit validation results and a human decision before action.",
              "PHASE 6",
            ],
            [
              "03",
              "Evaluation, not assumption",
              "Reproducible datasets, citation checks and private execution traces. Measure what the system actually does.",
              "PHASE 7",
            ],
          ].map(([n, title, body, phase]) => (
            <Reveal key={n} className="dp-future-row">
              <span className="dp-index">{n}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <span className="dp-eyebrow">{phase} · PLANNED</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="dp-closing dp-container">
        <Reveal>
          <ScanLine size={30} />
          <h2>Start with what’s there.</h2>
          <p>Seven modules. Real source. A different perspective.</p>
          <Link className="dp-button dp-primary" to="/devpulse/explore">
            Explore Dispatch <ArrowRight size={17} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
