# InboxFlow AI

- Demo: `/ai-message-processor`
- Case study: `/portfolio/ai-message-processor`
- API: `POST /api/ai-message-processor`

InboxFlow processes a single message; it has no conversation history. The existing portfolio dataset supplies its project card and reusable case study. Styles are scoped to `.inboxflow` and the page is lazy loaded.

## Request and response

Send JSON with a `message` string (5-4000 characters after validation) and optional `messageType`. Supported input values: `auto`, `email`, `chat`, `support_ticket`, `client_request`, `recruiter_message`, `internal_task`.

The successful response contains `ok`, `demoMode`, `provider` and `result`. Result fields: `messageType`, `category`, `priority`, `sentiment`, `summary`, nullable `deadline`, `tasks`, `suggestedReply`, `confidence`, `requiresFollowUp`. Tasks have `title`, nullable `owner` and nullable `dueDate`. Raw JSON displays the full API response.

Output priorities: low, medium, high, urgent. Sentiments: positive, neutral, negative, mixed. Output message types: email, chat_message, support_ticket, client_request, recruiter_message, internal_task, unknown.

## Configuration

Set server-side Cloudflare Pages environment variables:

- `AI_PROVIDER`: `openai` or `demo`. Missing provider uses demo.
- `AI_API_KEY`: provider secret, never a frontend/VITE variable.
- `AI_MODEL`: optional compatible structured-output model. Default `gpt-4o-mini`.

No secrets are supplied by this project. Variables are shared with Nova, but its endpoint and behavior are unchanged. InboxFlow currently implements only the OpenAI adapter and demo mode; other provider values return a JSON error.

Real analysis uses the OpenAI Chat Completions API with `response_format: json_schema`, strict schema validation and `store: false`. Adapter code is isolated in `requestAnalysis` for future provider expansion.

References: [OpenAI Chat API](https://developers.openai.com/api/reference/resources/chat), [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/).

## Demo and fallback

Without a key or provider, a deterministic rule-based engine detects common requests, approximate priority and sentiment, explicit task phrases and deadline expressions. Unknown owners and deadlines stay null. Relative deadlines are preserved as text; the demo does not resolve dates. The demo summary is an excerpt, not a generated semantic summary. Demo confidence is illustrative, not calibrated.

If the real provider fails, times out or returns invalid output, the same demo engine supplies a result with `demoReason: provider-fallback` and a visible warning. The UI never labels fallback output as real AI. Markdown JSON fences are stripped before parsing, but malformed JSON is not guessed or executed.

## Security and errors

- JSON input only, actual streamed payload capped at 20,000 bytes, message capped at 4,000 characters.
- Enum validation, strict result validation and reconstruction to discard unexpected fields.
- Provider timeout: 20 seconds; frontend timeout: 25 seconds. Navigation aborts the frontend request.
- JSON responses for all methods and errors; response caching disabled.
- No HTML injection, application persistence, conversation logging, D1, R2 or Resend use.
- In real AI mode the message is transmitted to the configured provider. `store: false` is not a promise of zero provider retention. Do not enter sensitive data.
- Provider error bodies and stack traces are never sent to the client.
- No authentication or rate limiting yet. Configure provider budget limits and access/rate controls before exposing a paid key to public traffic.
- Classifications and replies require human review. Prompt instructions reduce instruction injection risk but do not guarantee factual correctness.

## Manual verification

1. Open the demo and load each of the four examples. Analyze and check summary, signals, tasks, deadline and reply.
2. With no configuration, confirm Demo mode and valid raw JSON. Copy reply/JSON and check clipboard success or error feedback.
3. Edit the message after analysis: stale results clear. Test whitespace, 4-character input, overlong direct API payloads, invalid type, malformed JSON, wrong methods and unsupported provider.
4. Configure OpenAI server-side and check AI enabled. Simulate provider failure or invalid output and confirm the fallback warning.
5. Test missing backend, HTML response, offline mode and timeouts. Errors should be readable and input retained.
6. Test 320px, tablet and desktop, light/dark, keyboard focus and reduced motion. Check project card and both demo links.

The implementation was added without running npm, node, wrangler, development server or build, as requested. The helper functions were exercised in the tool's V8 isolate with all four examples, schema rejection and fenced JSON parsing. Fifteen additional endpoint checks used mocked request/response/provider adapters to cover validation, size limits, configuration and fallback. Browser rendering, Cloudflare runtime and deployed-provider verification remain required.

## Future work

Persistent workflows, email/Slack integrations, authentication, webhook actions, real task creation, rate limiting and analytics.
