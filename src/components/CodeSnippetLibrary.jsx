import { Copy, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { codeSnippets } from '../data/codeSnippets'

const languages = ['All', ...Array.from(new Set(codeSnippets.map((snippet) => snippet.language)))]

function CodeSnippetLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [languageFilter, setLanguageFilter] = useState('All')
  const [copiedId, setCopiedId] = useState('')

  const visibleSnippets = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return codeSnippets.filter((snippet) => {
      const matchesLanguage =
        languageFilter === 'All' || snippet.language === languageFilter
      const matchesSearch = [
        snippet.title,
        snippet.language,
        snippet.description,
        snippet.code,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

      return matchesLanguage && matchesSearch
    })
  }, [languageFilter, searchQuery])

  async function copySnippet(snippet) {
    if (!navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopiedId(snippet.id)
      window.setTimeout(() => setCopiedId(''), 1400)
    } catch {
      setCopiedId('')
    }
  }

  return (
    <section className="border-t border-white/10 bg-slate-950 px-5 py-16 sm:px-6 lg:px-8">
      <div id="code-snippet-library" className="mx-auto max-w-6xl scroll-mt-24">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Snippet Library
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">
            Small patterns I reuse while learning
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            Short examples for forms, API requests, localStorage, SQL and Git.
            This is not a full documentation page; it is a practical pocket
            shelf for common patterns.
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search code snippets</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search snippets"
              className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>

          <label className="block md:min-w-48">
            <span className="sr-only">Filter snippets by language</span>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visibleSnippets.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
            No snippets match the current search.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {visibleSnippets.map((snippet) => (
              <article
                key={snippet.id}
                className="rounded-md border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">
                      {snippet.language}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      {snippet.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {snippet.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copySnippet(snippet)}
                    className="inline-flex min-h-9 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <Copy size={15} />
                    {copiedId === snippet.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-md border border-white/10 bg-slate-950/80 p-4 font-mono text-sm leading-6 text-cyan-100">
                  <code>{snippet.code}</code>
                </pre>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CodeSnippetLibrary
