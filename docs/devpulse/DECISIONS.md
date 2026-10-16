# DevPulse AI — decision log

## Phase 1 implementation decisions — 2026-10-16

- D16: Use React Flow 12.12.0 for the full explorer. The Phase 1 user brief explicitly requires pan, zoom and fit; a lazy custom-node graph provides tested viewport behavior without implementing another graph engine. The landing keeps its smaller SVG/HTML graph. This supersedes the Phase 0 suggestion to defer React Flow.
- D17: Use Prism 1.30.0 in a lazy read-only viewer, not Monaco. Phase 1 needs source inspection rather than editing/diff models; the viewer chunk is 8.32 kB gzip and renders token spans through React, without injecting highlighted HTML. Monaco stays in Phase 6.
- D18: Generate fixture artifacts with the TypeScript compiler AST at development time. Source text is never executed in the UI; hashes normalize CRLF to LF for Windows/Linux reproducibility. This is a bounded trusted-fixture generator, not a parser for uploaded repositories.
- D19: Keep server and client metadata definitions together in `src/features/devpulse/metadata.ts`; existing Pages middleware imports that pure function only. Add one public OG SVG, without changing deployment settings. SVG social-image support varies by crawler; raster generation is a future release improvement.
- D20: Use system sans/monospace fonts in this release; no font network request or license/asset dependency. Dense metadata has an 11 px floor and source text 12 px, a deliberate adjustment to the proposed 12/13 px defaults; controls support reflow and zoom. Keep meaningful text fully opaque instead of dimming disconnected nodes below readable contrast.
- D21: Vitest covers deterministic fixtures and the actual Pages middleware. Playwright covers browser interactions and responsive rendering; axe checks all three views at mobile/desktop widths. CI checks only, no publishing job. Prettier formats new feature code only.
- D22: Preserve the existing eager portfolio entry. Incremental JS is approximately 0.61 kB gzip; the pre-existing ~378 kB entry remains the main performance constraint. A future narrowly scoped lazy-import optimization needs its own portfolio regression review. Phase 1 does not claim its 2.5 s lab LCP target passed.
- D23: PortableGit and browser output directories excluded from global lint; no product errors suppressed. Global lint remains at the original 39 project errors and 3 warnings. Nine npm audit entries refer to exactly the same package versions present in the baseline lockfile; do not apply an unrelated broad upgrade under this feature change.

The remaining Phase 0 decisions below retain their original planning context.

2026-10-16. Decisions below are planning choices; none imply that runtime components exist.

| ID | Decision / status | Rationale and trade-off |
| --- | --- | --- |
| D01 | Accepted for plan: integrated lazy frontend feature | Existing single Vite app and BrowserRouter support `/devpulse/*`; separate frontend/root relocation would add domain and deployment risk |
| D02 | Accepted for plan: lightweight multi-runtime repository | Python under `services/devpulse`, root npm app preserved; independent runtime dependencies without monorepo tooling overhead |
| D03 | Accepted for plan: API + worker modular monolith | FastAPI/Postgres/Redis and one codebase separate request handling from slow work; no need for microservices or multiple agents |
| D04 | Proposed: RQ with persisted job ledger/outbox | Small Python queue fits bounded stages; robust cancellation and crash recovery require application tests; switch only with evidence |
| D05 | Accepted for plan: separate private Postgres/object store | Existing D1 and public R2 serve portfolio concerns; pgvector shares authoritative DB instead of introducing another vector service |
| D06 | Accepted for plan: exact/lexical/structural retrieval first | Symbol/path questions benefit from deterministic context; embeddings conditional on measured gain and budgets |
| D07 | Proposed: LangGraph only for Phase 4 bounded AI paths | Persistence/conditional repair may justify it; plain typed state machine sufficient for deterministic ingestion |
| D08 | Proposed: optional metadata-only Langfuse export | Suitable privacy controls exist, but SDK/region/retention verification pending; core runs survive exporter failure |
| D09 | Accepted for plan: existing motion runtime and scoped visual system | Preserve portfolio styling and dependency economy; no global theme migration, default glass cards or heavy 3D |
| D10 | Accepted for plan: honest local sample in Phase 1 | Recruiter exploration works without infrastructure; visibly different from live analysis and later pinned-tool exports |
| D11 | Accepted for plan: read-only repository integration initially | Proposed patches can be reviewed/exported without remote write privileges; approval cannot be inferred from AI output |
| D12 | Accepted for plan: security/evaluation from first relevant slice | Untrusted ingestion needs archive/tool isolation in Phase 3, not only Phase 8; observability starts with job metadata in Phase 2 |
| D13 | Open deployment fact: Pages vs Workers assets | Local docs/config disagree; public nested HTML fallback works, but account deployment mode must be confirmed before preview/release configuration changes |
| D14 | Proposed: API subdomain with OIDC server sessions | Independent Python host, explicit credentialed CORS/CSRF, no shared admin token; provider/callback/preview behavior resolved in Phase 2 |
| D15 | Accepted for plan: preserve baseline debt transparently | Build passes but entry is large and lint fails; scoped DevPulse gates plus no new touched-file failures, not a false claim of global green CI |

## Reconsideration triggers

- More than one frontend or materially different build constraints may justify npm workspaces later; not now.
- RQ recovery/cancellation limitations demonstrated by failure tests may justify another queue; no speculative rewrite.
- LangGraph added only if a documented workflow needs checkpoint/resume; avoid duplicate competing state machines.
- If existing entry weight prevents Phase 1 performance targets, propose narrow lazy imports separately; do not change visual layouts or remove demos to hit a number.
- Hosting selection requires current capability/region/cost verification and user approval before any provisioning. No hosting price or free-tier assumption is embedded in this plan.
- New external writes require a separate security/API/approval design; GitHub read-only integration does not authorize them.

## Research references consulted

Official documentation consulted on 2026-10-16; implementation must recheck exact versions/options. No package versions were chosen for uninstalled backend libraries.

- [Cloudflare SPA serving](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Functions routing](https://developers.cloudflare.com/pages/functions/routing/), [Pages/Workers migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/).
- [RQ jobs/workers documentation](https://python-rq.org/docs/).
- [Semgrep rule execution](https://docs.semgrep.dev/running-rules).
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence).
- [Langfuse masking](https://langfuse.com/docs/observability/features/masking).
