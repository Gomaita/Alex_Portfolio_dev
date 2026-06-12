import { Bot, Check, Copy, Eraser, RefreshCw, Send, Sparkles, UserRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { sendNovaMessage } from '../services/aiChatService'
import usePageTitle from '../hooks/usePageTitle'

const STORAGE_KEY = 'nova-ai-chat-session'

const quickPrompts = [
  'Explain quantum computing in simple terms',
  'Give me ideas for a weekend project',
  'Help me write a professional email',
  'Explain this JavaScript concept',
  'Give me a workout plan for beginners',
  'Tell me a short story',
]

const modes = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'creative', label: 'Creative' },
  { id: 'precise', label: 'Precise' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'technical', label: 'Technical' },
]

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi, I am Nova. Ask me anything, choose a response mode and test the chat flow. Do not share sensitive personal information.',
  demoMode: true,
  provider: 'demo',
  model: 'welcome',
  createdAt: new Date().toISOString(),
}

function createMessage(role, content, extra = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    ...extra,
  }
}

function renderTextWithCode(content) {
  const parts = String(content || '').split(/```([\s\S]*?)```/g)

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const code = part.replace(/^[a-zA-Z0-9_-]+\n/, '')
      return (
        <pre key={index} className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
          <code>{code}</code>
        </pre>
      )
    }

    return (
      <div key={index} className="space-y-2">
        {part.split('\n').map((line, lineIndex) => {
          const cleanLine = line.trim()
          if (!cleanLine) return <div key={lineIndex} className="h-2" />
          const isList = /^[-*]\s+/.test(cleanLine) || /^\d+\.\s+/.test(cleanLine)
          return (
            <p key={lineIndex} className={`whitespace-pre-wrap ${isList ? 'pl-4' : ''}`}>
              {cleanLine}
            </p>
          )
        })}
      </div>
    )
  })
}

function NovaAIChat() {
  usePageTitle('Nova AI Chat | Alex Gómez')
  const [messages, setMessages] = useState(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
      return Array.isArray(stored) && stored.length ? stored : [welcomeMessage]
    } catch {
      return [welcomeMessage]
    }
  })
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('balanced')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [lastMeta, setLastMeta] = useState({ demoMode: true, provider: 'demo', model: 'demo' })
  const [copiedId, setCopiedId] = useState('')
  const scrollRef = useRef(null)

  const chatMessages = useMemo(() => messages.filter((message) => message.id !== 'welcome'), [messages])
  const statusLabel = lastMeta.demoMode ? 'Demo mode' : 'AI enabled'

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(nextInput = input, options = {}) {
    const cleanInput = String(nextInput || '').trim()
    if (!cleanInput || isSending) return
    if (cleanInput.length > 4000) {
      setError('Message is too long. Maximum length is 4000 characters.')
      return
    }

    setError('')
    setIsSending(true)

    const userMessage = createMessage('user', cleanInput)
    const baseMessages = options.baseMessages || messages
    const nextMessages = [...baseMessages, userMessage]
    setMessages(nextMessages)
    setInput('')

    try {
      const response = await sendNovaMessage({
        message: cleanInput,
        mode,
        messages: nextMessages
          .filter((message) => message.id !== 'welcome')
          .map((message) => ({ role: message.role, content: message.content })),
      })

      setLastMeta({
        demoMode: Boolean(response.demoMode),
        provider: response.provider,
        model: response.model,
      })
      setMessages((current) => [
        ...current,
        createMessage('assistant', response.reply || 'Nova returned an empty answer.', {
          demoMode: response.demoMode,
          provider: response.provider,
          model: response.model,
        }),
      ])
    } catch (err) {
      setError(err.message || 'Nova could not answer right now. Please try again in a moment.')
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([welcomeMessage])
    setError('')
    setLastMeta({ demoMode: true, provider: 'demo', model: 'demo' })
    sessionStorage.removeItem(STORAGE_KEY)
  }

  function regenerate() {
    const lastUserIndex = [...messages].map((message, index) => ({ message, index })).reverse().find((item) => item.message.role === 'user')?.index
    if (lastUserIndex === undefined) return

    const lastUser = messages[lastUserIndex]
    if (!lastUser) return
    sendMessage(lastUser.content, { baseMessages: messages.slice(0, lastUserIndex) })
  }

  async function copyMessage(message) {
    await navigator.clipboard.writeText(message.content)
    setCopiedId(message.id)
    window.setTimeout(() => setCopiedId(''), 1300)
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[radial-gradient(circle_at_top_left,#2563eb22,transparent_28%),radial-gradient(circle_at_top_right,#14b8a622,transparent_24%),#08111f] text-white">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col px-4 py-6 sm:px-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                <Sparkles size={20} />
              </span>
              <div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Nova AI Chat</h1>
                <p className="mt-1 text-sm text-slate-300">General-purpose AI chatbot demo</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1.5 text-xs font-black ${lastMeta.demoMode ? 'bg-amber-300 text-amber-950' : 'bg-emerald-300 text-emerald-950'}`}>
              {statusLabel}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
              {lastMeta.provider} · {lastMeta.model}
            </span>
          </div>
        </header>

        <div className="grid flex-1 gap-4 py-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <button
              type="button"
              onClick={clearChat}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-black text-slate-950 hover:bg-cyan-100"
            >
              <Eraser size={16} /> Clear chat
            </button>

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Response mode</p>
              <div className="mt-3 grid gap-2">
                {modes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                      mode === item.id ? 'bg-cyan-300 text-slate-950' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
              Do not share sensitive personal information.
            </p>
          </aside>

          <section className="flex min-h-[34rem] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30">
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              {chatMessages.length === 0 && (
                <div className="mx-auto max-w-3xl py-10 text-center">
                  <Bot className="mx-auto text-cyan-200" size={44} />
                  <h2 className="mt-4 text-2xl font-black">Start a conversation with Nova</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Ask for explanations, writing help, project ideas, code concepts, planning or a creative story.
                  </p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-left text-sm font-semibold text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <article key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${message.id === 'welcome' ? 'hidden' : ''}`}>
                  {message.role === 'assistant' && (
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
                      <Bot size={16} />
                    </span>
                  )}
                  <div className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-cyan-300 text-slate-950'
                      : 'border border-white/10 bg-white/[0.06] text-slate-100'
                  }`}
                  >
                    <div>{renderTextWithCode(message.content)}</div>
                    {message.role === 'assistant' && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-2 text-xs text-slate-400">
                        <span>{message.demoMode ? 'Demo mode' : 'AI response'}</span>
                        <button type="button" onClick={() => copyMessage(message)} className="inline-flex items-center gap-1 hover:text-white">
                          {copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}
                          {copiedId === message.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <UserRound size={16} />
                    </span>
                  )}
                </article>
              ))}

              {isSending && (
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
                    <Bot size={16} />
                  </span>
                  Nova is thinking...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/10 bg-slate-950 p-3 sm:p-4">
              {error && (
                <p className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Nova..."
                  rows={2}
                  className="min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/70"
                />
                <div className="grid gap-2">
                  <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-300 px-4 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={regenerate}
                    disabled={isSending || !messages.some((message) => message.role === 'user')}
                    className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">Press Enter to send. Shift+Enter adds a new line.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default NovaAIChat
