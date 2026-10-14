# InboxFlow AI

- Demo: `/ai-message-processor`
- Case study: `/portfolio/ai-message-processor`
- API: `POST /api/ai-message-processor`

InboxFlow processes a single message; it has no conversation history. The existing portfolio dataset supplies its project card and reusable case study. Styles are scoped to `.inboxflow` and the page is lazy loaded.

## Request and response

Send JSON with a `message` string (5-4000 characters after validation) and optional `messageType`. Supported input values: `auto`, `email`, `chat`, `support_ticket`, `client_request`, `recruiter_message`, `internal_task`.

The successful response contains `ok`, `demoMode`, `provider`, `model`, nullable `warning` and `result`. Result fields: `messageType`, `category`, `priority`, `sentiment`, `summary`, nullable `deadline`, `tasks`, `suggestedReply`, `confidence`, `requiresFollowUp`. Tasks have `title`, nullable `owner` and nullable `dueDate`. Raw JSON displays the full API response.

Output priorities: low, medium, high, urgent. Sentiments: positive, neutral, negative, mixed. Output message types: email, chat_message, support_ticket, client_request, recruiter_message, internal_task, unknown.

## Configuration

Set server-side Cloudflare Pages environment variables:

- `GROQ_API_KEY`: secret used only by the Pages Function. Configure it in Cloudflare, never in the repository or frontend.
- `GROQ_MODEL`: optional model name; default `openai/gpt-oss-120b`.

Recommended model: `GROQ_MODEL=openai/gpt-oss-120b`.

Lightweight fallback: `GROQ_MODEL=openai/gpt-oss-20b`.

The backend tries the configured model first, then `openai/gpt-oss-120b`, then `openai/gpt-oss-20b`. Duplicate names are skipped. A `model_not_found` response advances to the next model, as do other unsuccessful attempts. If none succeeds, the application uses demo fallback. All attempts share one 20-second timeout; exhaustion stops further requests. Availability still depends on the Groq account. On success, `model` contains the actual successful model, displayed by the existing UI. A successful retry includes a short fallback-model warning.

No secrets are supplied by this project. Configure the secret in the appropriate Cloudflare Pages production/preview environment and redeploy to apply it. InboxFlow now uses Groq whenever its secret is configured. It ignores `AI_PROVIDER`, `AI_API_KEY` and `AI_MODEL`, so Nova's configuration and endpoint remain independent and unchanged. No VITE-prefixed private variables are used.

Real analysis uses native fetch to `https://api.groq.com/openai/v1/chat/completions` with server-side Bearer authentication, temperature 0.2, max_tokens 1200 and streaming disabled. The system prompt contains the required JSON schema, output enums and instructions not to invent facts. The user prompt contains the selected message type and raw message.

The request retains `response_format: { type: 'json_object' }` for compatibility with custom models; schema adherence is validated in application code. References: [Groq JSON output modes](https://console.groq.com/docs/structured-outputs), [GPT OSS 120B](https://console.groq.com/docs/model/openai/gpt-oss-120b), [GPT OSS 20B](https://console.groq.com/docs/model/openai/gpt-oss-20b), [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/).

## Demo and fallback

Without `GROQ_API_KEY`, a deterministic rule-based engine detects common requests, approximate priority and sentiment, explicit task phrases and deadline expressions. The response uses `demoMode: true`, `provider: 'demo'`, `model: 'local-demo-rules'`, `warning: null`. Unknown owners and deadlines stay null. Relative deadlines are preserved as text; the demo does not resolve dates. The demo summary is an excerpt, not a generated semantic summary. Demo confidence is illustrative, not calibrated.

Successful Groq analysis uses `demoMode: false`, `provider: 'groq'` and the model that actually answered. `warning` is null for a successful first attempt, or a short fallback-model notice after a retry. The UI displays Groq AI enabled and the actual model only after receiving a successful analysis.

Markdown fences are stripped; accidental text around a balanced JSON object is ignored while respecting quoted braces and escape characters. Case variants and chat aliases are normalized. Unknown priority/sentiment/type values default to medium/neutral/unknown; numeric confidence is clamped to 0-1 (missing or invalid confidence becomes 0). Missing nullable text becomes null, missing tasks becomes an empty array, and boolean true/string 'true' is recognized for follow-up. Required category, summary, reply and task titles must still pass validation; malformed task structures are rejected, not guessed. Unexpected fields are removed.

If JSON parsing or validation fails, demo output uses `demoReason: 'invalid-output'` with warning `AI response could not be parsed as JSON, fallback parser used.` If Groq fails or times out, it uses `demoReason: 'provider-fallback'` with warning `Groq API request failed, demo fallback was used.` Both return `demoMode: true`, demo provider/model and a visible warning; the UI never labels fallback output as Groq AI.

## Security and errors

- JSON input only, actual streamed payload capped at 20,000 bytes, message capped at 4,000 characters.
- Enum validation, strict result validation and reconstruction to discard unexpected fields.
- Provider timeout: 20 seconds for all model attempts combined; frontend timeout: 25 seconds. Navigation aborts the frontend request.
- JSON responses for all methods and errors; response caching disabled.
- No HTML injection, application persistence, conversation logging, D1, R2 or Resend use.
- In real AI mode the message is transmitted to Groq. Application non-storage is not a promise about provider retention. Do not enter sensitive data.
- Provider error bodies and stack traces are never sent to the client.
- No authentication or rate limiting yet. Configure provider budget limits and access/rate controls before exposing a paid key to public traffic.
- Classifications and replies require human review. Prompt instructions reduce instruction injection risk but do not guarantee factual correctness.

## Manual verification

1. Open the demo and load each of the four examples. Analyze and check summary, signals, tasks, deadline and reply.
2. With no configuration, confirm Demo mode and valid raw JSON. Copy reply/JSON and check clipboard success or error feedback.
3. Edit the message after analysis: stale results clear. Test whitespace, 4-character input, overlong direct API payloads, invalid type, malformed JSON and wrong methods.
4. Configure `GROQ_API_KEY` server-side and check Groq AI enabled with `openai/gpt-oss-120b`. Set `GROQ_MODEL` to an unavailable model and check automatic recovery with the actual fallback model displayed. Test `GROQ_MODEL=openai/gpt-oss-20b` to verify it runs first. Simulate failure of every candidate and confirm Demo mode with the appropriate warning.
5. Test missing backend, HTML response, offline mode and timeouts. Errors should be readable and input retained.
6. Test 320px, tablet and desktop, light/dark, keyboard focus and reduced motion. Check project card and both demo links.

Verification used JavaScript in the tool's V8 isolate with mocked Web APIs, without npm, node, wrangler, a development server or build. 69 parser/backend checks and 11 frontend service checks passed, covering Groq request parameters, model overrides, fallback metadata, validation and error handling. These check logic and contracts, not actual Cloudflare execution, browser layout or live Groq responses. Those require manual verification after configuration and deployment.

## Future work

Rate limiting, authentication, persistent workflows, webhook actions, real task creation, integrations with email/Slack/Trello and analytics.
