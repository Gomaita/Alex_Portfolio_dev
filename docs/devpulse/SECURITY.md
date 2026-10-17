# DevPulse AI — threat model and security plan

Status: Phase 2 controls below are implemented; infrastructure-dependent checks remain pending. The remaining ingestion/AI requirements are future gates, not verified guarantees.

## Phase 2 controls and limits

- Fixed configured OIDC issuer, authorization-code PKCE S256, browser-bound one-use state with five-minute expiry, random nonce, RS256 signature/issuer/audience/exp/iat/authorized-party checks. No arbitrary identity supplied by the frontend, password store or development authentication bypass.
- Database-backed opaque sessions store only token/CSRF hashes. HttpOnly, host-only, SameSite=Lax; Secure plus `__Host-` cookie over HTTPS. Sessions expire (default eight hours); logout revokes DevPulse only, not the upstream IdP session. No access/refresh token persists. Email is optional verified metadata, never the security identity.
- Every resource lookup checks session user/owner and deletion state; missing and unauthorized projects/jobs share 404. Membership roles are future schema preparation and do not confer unimplemented team access. All projects are private.
- Mutations require exact Origin and session-bound CSRF. Redis-backed atomic rate limits fail closed; diagnostic task allowlist, two active jobs/project, bounded attempts/leases/deadline. No arbitrary worker command or repository execution exists.
- Strict Pydantic input/extra-field validation, 16 KiB streamed body limit, request-body timeout, bounded SQL pool/query timeouts, pagination/search limits, safe structured errors/request IDs, no request bodies/query strings/tokens in application logs. Unhandled error text is suppressed from API traceback logging. Hosting access logs require separate redaction configuration.
- Runtime secrets are server-only; only API URL is public Vite configuration. HTTPS/IdP are mandatory in production settings. No wildcard credentialed CORS or shared portfolio admin authentication. Separate API origin preserves existing Functions/D1/R2.
- Deletion is logical and immediately blocks access/cancels jobs. It does not physically purge records/backups. Retention scheduler, backup restore, IdP provisioning, live cookies/CORS and deployment verification remain production prerequisites.

Executed tests cover real locally signed JWT acceptance/rejection, production configuration, CORS, unauthenticated requests, input validation, payload limits, cancellation state and sanitized failures. PostgreSQL ownership/session/CSRF/OIDC-callback tests and real Redis worker execution are provided but skipped locally without infrastructure. Browser API doubles validate UX only. This is not a penetration-test or security certification claim. See PROGRESS and LOCAL_DEVELOPMENT for actual commands/results.

## Assets and trust boundaries

Private source, identity/session data, provider credentials, GitHub installation tokens, source artifacts, prompts and traces require protection. Attackers may supply hostile repository content, malicious URLs/archives, prompt injections, analyzer exploits, expensive requests, forged webhooks or guessed object IDs. Browser, API, queue, fetcher, analyzer/test runner, storage and LLM provider are separate trust boundaries.

The existing shared admin token and sessionStorage pattern must not be reused. Proposed OIDC authorization-code login with PKCE, state and nonce validation; server-side opaque sessions, secure HttpOnly host-only API cookies, expiry/rotation/revocation. Production same-site API subdomain is preferred; preview auth isolated from production. CSRF token plus exact Origin checking on cookie-authenticated mutations. CORS is not authorization. No tokens in localStorage, URLs or logs.

Project owner/editor/viewer permissions enforced at service/query boundaries, including source slices, search, graphs, citations, jobs, SSE, patches and downloads. Sample mode reads a separately curated fixture, never a private project made public by an unchecked flag. Test two users with disjoint project ownership. Public landing/sample uses no paid provider operations.

## Repository and archive boundary

- Accept only HTTPS GitHub repository owner/name URLs with a strict parser; reject credentials, custom ports, IP literals, non-GitHub hosts and arbitrary schemes. Parse ref separately. Do not fetch the submitted URL directly.
- Fetch through a constrained component using fixed GitHub API/archive endpoints, validated redirect targets, DNS/IP checks at connection time and egress policy blocking private, loopback, link-local and metadata ranges (IPv4/IPv6). Account for DNS rebinding and redirects; hostname validation alone is insufficient. No private credentials on public imports.
- Resolve commit before download; no git hooks, submodules, LFS retrieval, repository install commands or arbitrary remote URL references in manifests.
- Apply streaming compressed and expanded byte limits to GitHub archives too. Reject absolute/drive/UNC paths, `..`, NUL, backslash ambiguity, symlinks, hardlinks, device entries, duplicate normalized paths and case/Unicode collisions. Resolve output paths under a newly created root and never follow links.
- Proposed starting quotas: 20 MiB compressed, 100 MiB expanded, 5,000 files, 1 MiB per source file, depth 20, ratio 100:1; reject encrypted and nested archives. Enforce while reading, not just by trusting ZIP headers. Confirm these values with corpus tests before production.
- Exclude binary/generated/vendor/minified files and report exclusion counts. Preserve originals only in private encrypted storage according to retention; sanitized provider views retain stable line mappings. Scan secret-like material before AI/embedding/export. Redaction reduces risk, cannot guarantee discovery of all secrets.

## Tool and execution isolation

Even parsing and static analysis touch hostile input. Before Phase 3 imports, run tools as non-root in resource-limited ephemeral isolation: read-only source mount, bounded scratch space, no host sockets/credentials, no network, process/memory/CPU/time/output limits, pinned patched images. Trusted configurations only. ESLint config and plugins can execute code; never load those from the imported repository. Disable external rule downloading and telemetry unless explicitly approved.

API and orchestration workers never execute imported code. Test execution is a separate Phase 6 gate requiring stronger reviewed isolation (e.g. microVM or suitable sandbox provider), controlled egress and teardown. Docker alone must not be advertised as a complete hostile-code security boundary. Until that gate is met, display `not_run: isolated runner unavailable`. No user-defined shell commands in API payloads; runner accepts a bounded allowlisted job specification.

## AI boundary

Source, comments, READMEs, retrieved text and tool output are untrusted data, never authority for instructions. Delimit evidence, keep policy separate, use Pydantic schemas and least-privilege tools. Retrieval cannot cross project/snapshot boundaries. Model output is escaped plain text/sanitized Markdown, not executable HTML; sanitize links and disallow automatic remote image loading. Model proposals cannot grant permissions or approve tools.

Run prompt-injection tests for instruction-like comments, fake system messages, secret requests, tool requests and citation spoofing. A classifier is supplementary; permission enforcement remains deterministic. Validate citation existence/range/hash, then separately evaluate semantic support. Context limits and secret redaction apply to embeddings and repair prompts as well as answer generation.

Initial cost policy proposal: 2 concurrent runs per user, 5 imports/day, 20 AI requests/hour, configurable daily user/provider budget; reserve estimated maximum spend atomically before dispatch. Default provider spend cap must be configured explicitly before enabling AI. Reconcile actual usage, preserve unknown usage as unknown. Limit request/body size, tool output, total graph size, source slices and SSE connections. Backpressure at queue length thresholds; no unlimited retries.

## Data and observability

TLS in transit, encrypted managed database/object storage and least-privilege service accounts required. Provider keys only in secret management; separate dev/preview/production. User-managed API keys deferred; if added, envelope encryption/KMS, rotation and access auditing required. No raw source/prompt capture in public analytics. Metadata-only Langfuse export by default, explicit allowlists, redaction before SDK serialization and tests with planted secrets. Failure to export a trace must not fail analysis.

Proposed retention: raw snapshots 30 days, derived analyses/conversations 90 days, operational metadata 30 days; configurable project deletion overrides active data immediately. Backups may retain deleted content for up to a documented 30-day expiry, subject to chosen provider capability. Delete job verifies artifacts, embeddings, conversation context and external traces; report incomplete purge/retry. Treat these as target policies until implemented and tested. Obtain source-to-provider processing consent before first live AI use; repository access is not blanket permission to share with every provider.

## GitHub App and external writes

Phase 8 default installation permissions: metadata/read and contents/read for selected repositories only; validate actual GitHub permission requirements at implementation. Short-lived installation tokens, encrypted private key, signed webhook verification, replay/delivery deduplication, installation removal handling. User login identity and installation authorization are separate concepts.

Remote write remains unavailable unless a later explicit scope adds it. Such an operation would need human approval bound to repository, base commit, patch hash, action and expiry; recheck branch changes and installation permission immediately before dispatch. No automatic PR creation, commit, push or merge from model output.

## Security acceptance and release gates

Required tests: IDOR/cross-project search, CSRF/CORS, session expiry, malicious redirects/DNS/IPs, ZIP traversal/links/bombs/collisions, resource exhaustion, cancellation, secret leakage, prompt injection, output rendering, webhook signatures, stale-patch validation and deletion propagation. Use safe local adversarial fixtures, not active attacks on production. Pin trusted rules/dependencies and review licenses/SBOM before release. Keep unresolved risks documented; no claim of penetration testing or security certification without actual work.

Production transport validation: settings require PostgreSQL `sslmode=verify-full` and a `rediss://` Redis URL, in addition to HTTPS origins/OIDC. Configure the database CA/root certificate and Redis authentication/certificate trust at the host; development Compose remains loopback/private local networking.
