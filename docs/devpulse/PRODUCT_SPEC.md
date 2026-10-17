# DevPulse AI — product specification

Status: Phase 0 design, 2026-10-16. Nothing in this document is an implemented capability unless recorded in PROGRESS.md.

## Purpose and audience

Canonical frontend: `https://alexgl.dev/devpulse`. Tagline: **Understand your code. Improve what matters.** A flagship engineering product for repository understanding, evidence-based audits and human-reviewed fixes. Recruiters should understand the technical value within two minutes without credentials; authenticated developers should complete a reproducible analysis of their own repository.

## Product contracts

1. Repository intelligence: import public GitHub URLs first; constrained ZIP and installation-scoped GitHub App later. Show immutable snapshot identity, supported/unsupported files, manifests, symbols, imports, graph relationships and analysis history. An import graph is not automatically a runtime call graph.
2. Auditor: initial Python and JS/TS support. Run pinned Ruff, Semgrep and trusted JS/TS lint rules, normalize observations, then add separately attributed AI interpretation. A static match is not proof of exploitability. Show severity, confidence, category, verification state, tool/rule version and source location.
3. Ask Your Codebase: hybrid exact, lexical, structural and optional semantic retrieval; bounded source-backed answers with visible context. Report insufficient evidence and relevant follow-ups. Do not imply unsupported whole-repository coverage.
4. Fix Studio: proposed patch, explanation, Monaco diff, explicit reject/accept-for-export, applicability and independent validation results. No remote writes initially. Test execution only in an approved isolated runner.
5. Operations: real provider/model identifiers, nullable token usage, labeled cost estimates, stage timing, retries, failures, pipeline/prompt versions and evaluations. Internal traces restricted to authorized users.

## Experience map

All routes below are relative to `/devpulse`; future routes are added only with working content.

| Route | Purpose | First phase |
| --- | --- | --- |
| `/` | Product introduction and interactive sample architecture | 1 |
| `/explore` | Explicitly labeled local sample repository overview | 1 |
| `/explore/architecture` | Sample graph and source evidence | 1 |
| `/projects`, `/projects/new` | Authorized dashboard and repository import | 2 / 3 |
| `/projects/:projectId` | Repository overview and latest completed run | 3 |
| `/projects/:projectId/architecture`, `/code` | Snapshot-specific graph/source | 3 |
| `/projects/:projectId/findings`, `/findings/:findingId` | Filtered observations and source details | 3 / 5 |
| `/projects/:projectId/chat` | Source-grounded conversation | 4 |
| `/projects/:projectId/patches/:patchId` | Review and validation evidence | 6 |
| `/projects/:projectId/history`, `/runs/:runId` | Commit/pipeline history and authorized stage timeline | 3 |
| `/projects/:projectId/runs/:runId/traces` | Restricted detailed operations | 7 |
| `/evaluations` | Authorized reproducible evaluation reports | 7 |
| `/settings`, `/projects/:projectId/settings` | Session, retention, membership and integration settings | 2 / 8 |
| `/*` | DevPulse-specific not-found and return links | 1 |

## Core journeys and honest states

- Visitor: landing → sample overview → graph node → actual bundled source lines → portfolio return. Banner says “Sample repository — local fixture, not a live scan”. No sign-up, API key or fake analysis timer.
- Developer: authenticate → create project → submit repository → inspect queued/stage/error state → browse immutable results → ask a grounded question → review a patch → inspect validation → explicitly export.
- Reviewer: inspect methodology, pipeline/tool versions, retrieved context, actual evaluation results and limitations. Public reports are separately curated exports.
- Every async surface has loading, empty, retryable error, permission denied, expired/deleted snapshot and success states. Partial analysis must list failed/skipped tools; zero findings must not imply security.
- Keep filter/snapshot selection in URL state. Display readable errors with correlation IDs, never raw stack traces. Preserve entered text on retry and prevent duplicate submissions.

## Scope and success

Initial languages: Python, JS, JSX, TS, TSX; other files get inventory-only status. Initial live imports are authenticated and quota-limited. No arbitrary URL fetching, automatic merges, general-purpose agent shell, billing system, Kubernetes or autonomous multi-agent marketing.

Success requires both a polished visitor journey and real reproducible end-to-end analysis. Acceptance gates and evaluation definitions live in EVALUATION_PLAN.md. Visual polish never substitutes for evidence or implemented behavior.
