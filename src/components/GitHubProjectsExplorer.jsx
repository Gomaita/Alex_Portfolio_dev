import { motion } from 'framer-motion'
import { ExternalLink, GitFork, RotateCcw, Search, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_GITHUB_USERNAME,
  fetchGitHubRepos,
} from '../services/githubApi'

const technicalBadges = [
  'GitHub API',
  'Dynamic Lists',
  'Filtering',
  'Sorting',
  'Error Handling',
]

const sortOptions = [
  { label: 'Recently updated', value: 'updated' },
  { label: 'Most stars', value: 'stars' },
  { label: 'Name A-Z', value: 'name' },
]

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
})

function GitHubProjectsExplorer() {
  const [username, setUsername] = useState(DEFAULT_GITHUB_USERNAME)
  const [submittedUsername, setSubmittedUsername] = useState(DEFAULT_GITHUB_USERNAME)
  const [repos, setRepos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [repoSearch, setRepoSearch] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated')

  useEffect(() => {
    let isMounted = true

    async function loadRepos() {
      setIsLoading(true)
      setError('')

      try {
        const repoData = await fetchGitHubRepos(submittedUsername)

        if (isMounted) {
          setRepos(repoData)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load repositories right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadRepos()

    return () => {
      isMounted = false
    }
  }, [submittedUsername])

  const isUsingMockData = repos.some((repo) => repo.isMock)

  const availableLanguages = useMemo(() => {
    const languages = repos.map((repo) => repo.language).filter(Boolean)
    return ['all', ...Array.from(new Set(languages)).sort()]
  }, [repos])

  const visibleRepos = useMemo(() => {
    const normalizedSearch = repoSearch.trim().toLowerCase()

    return repos
      .filter((repo) => {
        const matchesSearch = repo.name.toLowerCase().includes(normalizedSearch)
        const matchesLanguage =
          languageFilter === 'all' || repo.language === languageFilter

        return matchesSearch && matchesLanguage
      })
      .sort((repoA, repoB) => {
        if (sortBy === 'stars') {
          return repoB.stars - repoA.stars
        }

        if (sortBy === 'name') {
          return repoA.name.localeCompare(repoB.name)
        }

        return new Date(repoB.updatedAt) - new Date(repoA.updatedAt)
      })
  }, [repos, repoSearch, languageFilter, sortBy])

  function handleSubmit(event) {
    event.preventDefault()
    setSubmittedUsername(username.trim() || DEFAULT_GITHUB_USERNAME)
  }

  function resetUsername() {
    setUsername(DEFAULT_GITHUB_USERNAME)
    setSubmittedUsername(DEFAULT_GITHUB_USERNAME)
    setRepoSearch('')
    setLanguageFilter('all')
    setSortBy('updated')
  }

  return (
    <motion.section
      id="github-explorer"
      aria-labelledby="github-explorer-title"
      aria-busy={isLoading}
      className="mb-16 overflow-hidden rounded-md border border-cyan-300/15 bg-slate-950/70 shadow-2xl shadow-slate-950/40"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Public API Demo
          </p>
          <h3
            id="github-explorer-title"
            className="mt-3 text-3xl font-bold tracking-normal text-white sm:text-4xl"
          >
            GitHub Projects Explorer
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            A GitHub repository explorer that demonstrates public API
            consumption, dynamic rendering, filtering, sorting and graceful
            fallback handling.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {technicalBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6 lg:p-8">
        <form
          className="grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 lg:grid-cols-[1fr_auto_auto]"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              GitHub username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="GitHub username"
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={18} />
            Search
          </button>
          <button
            type="button"
            onClick={resetUsername}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </form>

        {isUsingMockData && !isLoading && (
          <p className="rounded-md border border-violet-300/25 bg-violet-300/10 px-4 py-3 text-sm font-medium text-violet-100">
            Showing fallback demo data.
          </p>
        )}

        {error && (
          <div
            className="rounded-md border border-red-400/25 bg-red-500/10 p-5"
            role="alert"
          >
            <p className="font-semibold text-red-100">GitHub data unavailable</p>
            <p className="mt-2 text-sm leading-6 text-red-100/80">{error}</p>
          </div>
        )}

        <div className="grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 lg:grid-cols-3">
          <label className="relative block">
            <span className="sr-only">Search repositories by name</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              value={repoSearch}
              onChange={(event) => setRepoSearch(event.target.value)}
              placeholder="Search repositories"
              className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter repositories by language</span>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            >
              {availableLanguages.map((language) => (
                <option key={language} value={language}>
                  {language === 'all' ? 'All languages' : language}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Sort repositories</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
          {isLoading &&
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-56 animate-pulse rounded-md border border-white/10 bg-slate-950/60 p-5"
              >
                <div className="h-5 w-40 rounded bg-white/10" />
                <div className="mt-5 h-4 w-full rounded bg-white/10" />
                <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
                <div className="mt-8 flex gap-2">
                  <div className="h-7 w-20 rounded bg-cyan-300/10" />
                  <div className="h-7 w-20 rounded bg-cyan-300/10" />
                </div>
              </div>
            ))}

          {!isLoading && visibleRepos.length === 0 && (
            <div className="rounded-md border border-white/10 bg-slate-950/60 p-6 text-center text-sm leading-6 text-slate-400 md:col-span-2">
              No repositories match the current search, language filter or sort.
            </div>
          )}

          {!isLoading &&
            visibleRepos.map((repo, index) => (
              <motion.article
                key={repo.id}
                className="flex min-h-56 flex-col rounded-md border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-300/40 hover:bg-slate-900/80"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{repo.name}</h4>
                    <p className="mt-2 text-sm text-slate-400">
                      Updated {dateFormatter.format(new Date(repo.updatedAt))}
                    </p>
                  </div>
                  <span className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                    {repo.language}
                  </span>
                </div>

                <p className="mt-4 flex-1 leading-7 text-slate-300">
                  {repo.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {repo.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-xs font-semibold text-violet-100"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-4 text-sm font-semibold text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Star size={16} /> {repo.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork size={16} /> {repo.forks}
                    </span>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    View on GitHub <ExternalLink size={16} />
                  </a>
                </div>
              </motion.article>
            ))}
        </div>
      </div>
    </motion.section>
  )
}

export default GitHubProjectsExplorer
