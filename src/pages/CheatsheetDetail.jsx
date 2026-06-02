import { motion } from 'framer-motion'
import { ArrowLeft, Copy } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCheatsheetBySlug } from '../data/cheatsheets'

function SnippetCard({ item }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(item.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-md border border-white/10 bg-slate-950/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-cyan-100">
          <code>{item.code}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Copy size={13} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{item.note}</p>
    </div>
  )
}

function CheatsheetDetail() {
  const { slug } = useParams()
  const cheatsheet = getCheatsheetBySlug(slug)

  if (!cheatsheet) {
    return (
      <section className="min-h-[calc(100svh-5rem)] bg-slate-950 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-md border border-white/10 bg-white/[0.04] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Cheatsheet not found</h1>
          <p className="mt-3 text-slate-300">
            The requested reference page does not exist.
          </p>
          <Link
            to="/cheatsheets"
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Back to Cheatsheets
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/cheatsheets"
          className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <ArrowLeft size={16} />
          Back to Cheatsheets
        </Link>

        <motion.header
          className="mb-8 rounded-md border border-cyan-300/15 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            {cheatsheet.category}
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-2xl font-bold text-cyan-100">
              {cheatsheet.iconText}
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-normal text-white sm:text-5xl">
                {cheatsheet.title} Cheatsheet
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                {cheatsheet.description}
              </p>
            </div>
          </div>
        </motion.header>

        <nav
          className="mb-8 flex flex-wrap gap-2 rounded-md border border-white/10 bg-slate-950/60 p-4"
          aria-label="Cheatsheet sections"
        >
          {cheatsheet.sections.map((section) => (
            <a
              key={section.title}
              href={`#${section.title.toLowerCase().replaceAll(' ', '-')}`}
              className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cheatsheet.sections.map((section, index) => (
            <motion.article
              key={section.title}
              id={section.title.toLowerCase().replaceAll(' ', '-')}
              className="rounded-md border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-slate-950/20"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.035 }}
            >
              <h2 className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-base font-bold text-cyan-100">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <SnippetCard key={`${section.title}-${item.code}`} item={item} />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CheatsheetDetail
