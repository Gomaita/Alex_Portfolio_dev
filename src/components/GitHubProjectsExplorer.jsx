import { motion } from 'framer-motion'
import { ExternalLink, GitFork, RotateCcw, Search, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_GITHUB_USERNAME,
  fetchGitHubRepos,
} from '../services/githubApi'
import DemoNotice from './ui/DemoNotice'

const technicalBadges = ['GitHub API', 'Search', 'Filtering', 'Sorting', 'Fallback data']

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
        if (isMounted) setRepos(repoData)
      } catch {
        if (isMounted) setError('Unable to load repositories right now.')
      } finally {
        if (isMounted) setIsLoading(false)
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
        if (sortBy === 'stars') return repoB.stars - repoA.stars
        if (sortBy === 'name') return repoA.name.localeCompare(repoB.name)
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
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Public API demo
        </p>
        <h3
          id="github-explorer-title"
          className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl"
        >
          GitHub Projects Explorer
        </h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          A repository explorer built to practice public API data, filtering,
          sorting and empty or fallback states.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {technicalBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6 lg:p-8">
        <DemoNotice>
          API demo. Data may depend on external service availability.
        </DemoNotice>

        <form
          className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-700">GitHub username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="GitHub username"
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={18} />
            Search
          </button>
          <button
            type="button"
            onClick={resetUsername}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </form>

        {isUsingMockData && !isLoading && (
          <p className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
            Showing fallback demo data.
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5" role="alert">
            <p className="font-semibold text-red-700">GitHub data unavailable</p>
            <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
          </div>
        )}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-3">
          <label className="relative block">
            <span className="sr-only">Search repositories by name</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={repoSearch}
              onChange={(event) => setRepoSearch(event.target.value)}
              placeholder="Search repositories"
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <select
            value={languageFilter}
            onChange={(event) => setLanguageFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label="Filter repositories by language"
          >
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {language === 'all' ? 'All languages' : language}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label="Sort repositories"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
          {isLoading &&
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-56 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-40 rounded bg-slate-200" />
                <div className="mt-5 h-4 w-full rounded bg-slate-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-8 flex gap-2">
                  <div className="h-7 w-20 rounded bg-blue-100" />
                  <div className="h-7 w-20 rounded bg-blue-100" />
                </div>
              </div>
            ))}

          {!isLoading && visibleRepos.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm leading-6 text-slate-600 shadow-sm md:col-span-2">
              No repositories match the current search, language filter or sort.
            </div>
          )}

          {!isLoading &&
            visibleRepos.map((repo, index) => (
              <motion.article
                key={repo.id}
                className="flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-950">{repo.name}</h4>
                    <p className="mt-2 text-sm text-slate-500">
                      Updated {dateFormatter.format(new Date(repo.updatedAt))}
                    </p>
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {repo.language}
                  </span>
                </div>

                <p className="mt-4 flex-1 leading-7 text-slate-600">
                  {repo.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {repo.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-4 text-sm font-semibold text-slate-600">
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
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
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
