import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const filters = ['All', 'Environments', 'Props', 'Materials', 'Procedural', 'VR', 'Real-time']

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

function projectMatchesFilter(project, filter) {
  if (filter === 'All') return true

  const haystack = [
    project.category,
    ...(project.categories || []),
    ...(project.tags || []),
    project.assetType,
    project.engine,
    project.textureWorkflow,
    ...(project.tools || []),
    ...(project.softwareUsed || []),
    ...(project.techniques || []),
  ].join(' ').toLowerCase()

  const aliases = {
    Environments: ['environment'],
    Props: ['prop'],
    Materials: ['material', 'pbr'],
    Procedural: ['procedural', 'substance designer', 'substance 3d designer'],
    VR: ['vr'],
    'Real-time': ['real-time', 'realtime', 'game-ready', 'game ready', 'engine'],
  }

  return (aliases[filter] || [filter.toLowerCase()]).some((alias) => haystack.includes(alias))
}

function getProjectDate(project) {
  return Date.parse(project.publishedAt || project.createdAt || project.created_at || project.date || project.year || '') || 0
}

function ThreeDProjects() {
  usePageTitle('3D Projects | Alex Gómez')
  const [projects, setProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortMode, setSortMode] = useState('featured')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getPublished3DProjects().then(setProjects)
  }, [])

  const filteredProjects = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    return projects
      .filter((project) => projectMatchesFilter(project, activeFilter))
      .filter((project) => {
        if (!cleanQuery) return true
        return [
          project.title,
          project.subtitle,
          project.category,
          project.role,
          project.engine,
          project.assetType,
          ...(project.tools || []),
          ...(project.softwareUsed || []),
          ...(project.tags || []),
        ].join(' ').toLowerCase().includes(cleanQuery)
      })
      .sort((a, b) => {
        if (sortMode === 'newest') return getProjectDate(b) - getProjectDate(a)
        if (sortMode === 'oldest') return getProjectDate(a) - getProjectDate(b)
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
      })
  }, [activeFilter, projects, query, sortMode])

  return (
    <ThreeDLayout>
      <section className="px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#13aff0]">Artwork gallery</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50 sm:text-5xl">Projects</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Environment art, props and real-time material work.
              </p>
            </div>

            <div className="w-full rounded-xl border border-white/10 bg-[#15181d]/90 p-3 lg:max-w-2xl">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="sr-only" htmlFor="three-d-search">Search artworks</label>
                <input
                  id="three-d-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by artwork, tool or tag"
                  className="min-h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-[#13aff0]/70"
                />
                <label className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 text-xs font-bold text-zinc-300">
                  <SlidersHorizontal size={15} />
                  <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value)}
                    className="bg-transparent text-xs font-bold text-zinc-200 outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[#15181d] text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      activeFilter === filter
                        ? 'bg-[#13aff0] text-slate-950'
                        : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-100'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProjects.length ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ThreeDProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-white/10 bg-[#15181d]/80 p-8 text-center">
              <p className="text-base font-bold text-zinc-100">No artworks published yet.</p>
              <p className="mt-2 text-sm text-zinc-500">New work is being prepared.</p>
            </div>
          )}
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDProjects
