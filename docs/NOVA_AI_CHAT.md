# Nova AI Chat

Nova AI Chat is a general-purpose conversational chatbot demo for the software portfolio.

## Routes

- Public app: `/ai-chat`
- Portfolio detail: `/portfolio/ai-chatbot`
- Backend endpoint: `POST /api/ai-chat`

## Endpoint

`POST /api/ai-chat`

Request:

```json
{
  "message": "Explain closures in JavaScript",
  "messages": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous reply" }
  ],
  "mode": "balanced"
}
```

Response:

```json
{
  "ok": true,
  "reply": "Nova response...",
  "mode": "balanced",
  "provider": "demo",
  "model": "demo-rule-based",
  "demoMode": true
}
```

## Environment Variables

Do not expose these in frontend code.

- `AI_PROVIDER`: `openai`, `anthropic`, `cloudflare-ai` or `demo`
- `AI_API_KEY`: private API key for the selected provider
- `AI_MODEL`: model name for the selected provider

Examples:

```text
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_KEY=use-a-cloudflare-secret
```

```text
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-haiku-latest
AI_API_KEY=use-a-cloudflare-secret
```

For Cloudflare Workers AI, configure the AI binding and use:

```text
AI_PROVIDER=cloudflare-ai
AI_MODEL=@cf/meta/llama-3.1-8b-instruct
```

## Demo Mode

If no `AI_API_KEY` is configured and the provider is not `cloudflare-ai`, the endpoint returns a rule-based demo response.

Demo mode keeps the UI usable without a real provider:

- quick prompts still work
- response modes still affect the simulated answer style
- copy, regenerate and clear actions still work
- no private API key is required

## Session Storage

The frontend stores chat history in `sessionStorage` only.

This means:

- the conversation survives route refreshes in the same tab
- closing the tab clears the session
- no chat history is written to D1
- no chat history is stored in R2

## Security Decisions

- AI keys stay on the Cloudflare Pages Function side.
- No `VITE_AI_API_KEY` is used.
- The endpoint validates required input.
- Messages are limited to 4000 characters.
- The backend sends at most 20 history messages to the provider.
- Long history messages are trimmed.
- Errors are returned as JSON.
- Stack traces and secrets are not exposed.
- Conversations are not persisted.

## Response Modes

Supported modes:

- `balanced`
- `creative`
- `precise`
- `friendly`
- `technical`

The mode is added to the system prompt so the provider can adjust tone and detail.

## Current Limitations

- No streaming responses yet.
- No authentication.
- No persistent chat history.
- No file uploads.
- No rate limiting yet.
- Provider switching is configured through environment variables, not the UI.

## Future Improvements

- streaming responses
- authenticated saved chats
- provider switcher
- file uploads
- rate limiting
- usage metrics
- conversation export
