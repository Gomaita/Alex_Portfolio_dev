import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import CheatsheetCard from '../components/cheatsheets/CheatsheetCard'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { cheatsheetCategories, cheatsheets } from '../data/cheatsheets'

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
    <main className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] dark:bg-slate-950">
      <Section className="pt-16">
        <PageHeader
          eyebrow="Pocket reference"
          title="Programming Cheatsheets"
          description="Short syntax references for languages, web basics and tools I want close while studying or building."
        />

        <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <label className="relative block">
            <span className="sr-only">Search cheatsheets</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={18}
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search language, category or topic"
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {cheatsheetCategories.map((category) => (
              <Button
                key={category}
                onClick={() => setCategoryFilter(category)}
                size="small"
                variant={categoryFilter === category ? 'primary' : 'secondary'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredCheatsheets.length === 0 ? (
          <EmptyState
            title="No cheatsheets found"
            text="Try a different search or category."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCheatsheets.map((cheatsheet) => (
              <CheatsheetCard key={cheatsheet.id} cheatsheet={cheatsheet} />
            ))}
          </div>
        )}
      </Section>
    </main>
  )
}

export default Cheatsheets
