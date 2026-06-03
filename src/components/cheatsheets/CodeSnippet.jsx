import { Copy } from 'lucide-react'
import { useState } from 'react'

function CodeSnippet({ item }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!navigator.clipboard) return

    try {
      await navigator.clipboard.writeText(item.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex items-start justify-between gap-3">
        <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-cyan-100">
          <code>{item.code}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Copy size={13} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{item.note}</p>
    </div>
  )
}

export default CodeSnippet
