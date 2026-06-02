import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cheatsheetCategories, cheatsheets } from '../data/cheatsheets'

const accentStyles = {
  cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  blue: 'border-blue-300/25 bg-blue-300/10 text-blue-100',
  violet: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
}

function Cheatsheets() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredCheatsheets = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return cheatsheets.filter((cheatsheet) => {
      const matchesCategory =
        categoryFilter === 'All' || cheatsheet.category === categoryFilter
      const matchesSearch = [
        cheatsheet.title,
        cheatsheet.category,
        cheatsheet.description,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [categoryFilter, searchQuery])

  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Pocket Reference
          </p>
          <h1 className="text-4xl font-bold tracking-normal text-white sm:text-5xl">
            Programming Cheatsheets
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            Quick syntax references for languages, web technologies and
            developer tools.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search cheatsheets</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by language, category or topic"
              className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {cheatsheetCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`min-h-10 rounded-md border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                  categoryFilter === category
                    ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                    : 'border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredCheatsheets.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">
            No cheatsheets match the current search or category.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCheatsheets.map((cheatsheet, index) => {
              const topics = cheatsheet.sections.slice(0, 3).map((section) => section.title)

              return (
                <motion.article
                  key={cheatsheet.id}
                  className="flex h-full flex-col rounded-md border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.07]"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.035 }}
                >
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-md border text-lg font-bold ${
                      accentStyles[cheatsheet.accent] || accentStyles.cyan
                    }`}
                  >
                    {cheatsheet.iconText}
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                    {cheatsheet.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {cheatsheet.title}
                  </h2>
                  <p className="mt-3 flex-1 leading-7 text-slate-300">
                    {cheatsheet.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-xs font-semibold text-violet-100"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/cheatsheets/${cheatsheet.slug}`}
                    className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Open Cheatsheet
                  </Link>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Cheatsheets
