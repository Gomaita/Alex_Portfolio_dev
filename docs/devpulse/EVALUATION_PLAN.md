# DevPulse AI — evaluation and acceptance

Status: planned datasets and gates. No AI evaluation has been run; no accuracy figures are product claims.

## Reproducible fixtures

Maintain small first-party Python and TS/JS fixture repositories with both faulty and corrected cases, real source files, licenses and immutable content hashes. Phase 1 uses a clearly labeled local sample with source-backed architecture only; no fabricated scanner output. Phase 3 exports real pinned-tool results and provenance. Never claim a fixture has a Git commit unless it actually does.

Each evaluation case records ID, dataset version/split, language, snapshot/hash, question/task, expected source spans or finding, negative controls, reasoning rubric and author review. Version pipeline, rule/config hashes, prompt hash, provider/model ID, embedding version, retrieval settings, seed when supported and run timestamp. Model nondeterminism remains documented. Store raw denominators and per-case outcomes, not just rounded headline scores.

Start with 40 question cases across both languages: 10 architecture, 10 symbols/functionality, 10 imports/dependencies, 10 deliberately unanswerable. Split 24 development / 16 held-out with balanced categories; expand before making broad quality claims. Add 20 faulty and 20 clean static-analysis cases, 20 patch cases (including stale bases and nonapplicable changes), and at least 20 adversarial cases for secrets, injection and authorization. These counts are future minimums, not existing files.

## Metrics and proposed release thresholds

| Metric | Definition | Initial gate |
| --- | --- | --- |
| Citation validity | Existing snapshot/path, in-range lines and matching source hash / all citations | 100% deterministic check |
| Citation support precision | Human-supported claim-citation pairs / reviewed pairs | >=95%; report sample size |
| Citation coverage | Supported factual claims with evidence / claims needing evidence | >=90% |
| Retrieval Recall@10 | Required annotated evidence units found in top 10 / all required units | >=85% held-out |
| Retrieval MRR@10 | Mean reciprocal rank of first relevant span; 0 when absent | report exact+lexical baseline and hybrid delta |
| Abstention correctness | Correct abstentions on unsupported questions / unsupported cases | >=90% |
| Static false-positive rate | Clean negative cases incorrectly flagged / clean cases | <=5% on fixture suite |
| Finding precision | True supported findings / reviewed emitted findings, per tool/category | >=90%, separately from recall |
| Patch applicability | Patches that apply to exact base / generated patches | >=95% on held-out supported tasks |
| Patch validation | Counts per check: passed/failed/error/not_run/inconclusive | 100% explicit, never infer tests passed |
| Budget compliance | Executions staying within configured token/cost policy / executions | 100% policy tests |
| Isolation and access | Cross-project leaks, source-policy bypass, sandbox escape in tested cases | 0 observed; not a universal guarantee |

Small datasets give coarse estimates; publish counts and confidence intervals where suitable. Do not tune on the held-out split. LLM judge can assist triage but cannot be sole evidence for citation support or vulnerability correctness. Avoid hiding failures by dropping errored cases: report both completed and all-attempted denominators.

Hybrid retrieval must be compared to exact+lexical baseline on the same snapshots; record latency, index size and provider cost. Enable embeddings by default only if Recall@10 improves by at least 5 percentage points without material MRR regression and stays within recorded budgets. Otherwise keep lexical/structural retrieval as default and document results.

Patch applicability is not bug-fix correctness. Require independent regression tests or human-reviewed expected behavior for a correctness claim. A patch with skipped tests can be exported with explicit limitations but cannot be labeled fully validated. No automatic “verified vulnerability” from LLM agreement.

## Automated engineering checks by layer

- Frontend: strict TS, scoped lint, Vitest/Testing Library for meaningful route/filter/evidence behavior; Playwright for visitor journey, refresh, back/forward, authorization states later, and keyboard/reduced-motion/mobile interactions.
- Backend: Pytest unit tests for validators/state machines/retrieval; integration tests with actual PostgreSQL/pgvector and Redis for migrations, ownership, outbox/retry/cancel/recovery; contract generation drift check.
- Tools: pinned image/rule versions, hostile archive corpus, parser coverage, normalization and snapshot citation fixtures. Do not execute the repository being audited during CI tests.
- AI: deterministic fake adapter for CI contract failures, timeouts and budgets; separately gated live-provider benchmark with recorded cost and privacy-safe fixture inputs. Fake adapter results never count as model accuracy.
- CI from Phase 1: clean checkout build, scoped quality gates and relevant UI checks. Phase 2 adds backend/migration jobs; Phase 3 static fixtures; Phase 4 offline retrieval and optional manually invoked provider evals; Phase 6 sandbox checks; Phase 9 full regression. Untrusted PRs receive no provider secrets or deployment credentials.

## Phase 1 acceptance checklist

1. Landing, sample overview and architecture deep links render and refresh; unknown DevPulse path shows its own NotFound.
2. All existing route families preserve layout/navigation; screenshots at representative mobile/desktop sizes and regression checks for route metadata.
3. Sample banner always visible; selecting a node opens its actual source lines; linked imports are present in the fixture; no fake live actions.
4. Keyboard-only graph/list navigation, labeled controls, focus restoration, reduced motion, 200% zoom and no page overflow at 320 px.
5. Build and new TS/scoped lint/tests pass. Existing global lint failures remain separately reported; no new failures in touched existing files. Do not silently waive them.
6. Record bundle delta and three mobile-throttled measurements using DESIGN_SYSTEM budgets; report unmet budgets honestly.
7. Metadata correctly identifies `/devpulse`; nested/private future pages get deliberate indexing rules. Browser tests cannot substitute for checking raw HTML metadata.

Phase 9 additionally requires deployment-mode confirmation, staging refresh/API/CORS checks, real backup restore and deletion tests, quotas and cost alerts, failure-recovery exercises, accessibility review and approved production verification. No release until required controls work.
