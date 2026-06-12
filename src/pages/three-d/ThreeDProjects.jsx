import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const filters = [
  'All',
  'Environments',
  'Props',
  'Materials',
  'VR Assets',
  'Unreal',
  'Unity',
  'Substance Designer',
  'Substance Painter',
]

const sortOptions = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

function projectMatchesFilter(project, filter) {
  if (filter === 'All') return true

  const haystack = [
    project.category,
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
    Materials: ['material', 'pbr', 'procedural'],
    'VR Assets': ['vr'],
    Unreal: ['unreal'],
    Unity: ['unity'],
    'Substance Designer': ['substance designer'],
    'Substance Painter': ['substance painter'],
  }

  return (aliases[filter] || [filter.toLowerCase()]).some((alias) => haystack.includes(alias))
}

function getProjectDate(project) {
  return Date.parse(project.createdAt || project.created_at || project.date || project.year || '') || 0
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
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">Art gallery</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
                3D Projects
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
                A curated space for environments, props, PBR materials and real-time studies. Each project is prepared to show both the final render and the technical process behind it.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="sr-only" htmlFor="three-d-search">Search 3D projects</label>
                <input
                  id="three-d-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by project, tool or role"
                  className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-semibold text-white outline-none placeholder:text-zinc-600 focus:border-sky-300/70"
                />
                <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-bold text-zinc-300">
                  <SlidersHorizontal size={16} />
                  <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value)}
                    className="bg-transparent text-sm font-bold text-zinc-200 outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[#12161c] text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition ${
                      activeFilter === filter
                        ? 'bg-sky-300 text-slate-950 shadow-lg shadow-sky-500/20'
                        : 'border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-sky-300/50 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProjects.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ThreeDProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-white/10 bg-[#12161c]/80 p-10 text-center shadow-2xl shadow-black/20">
              <p className="text-lg font-black text-white">No 3D projects published yet.</p>
              <p className="mt-2 text-sm text-zinc-400">New work is being prepared.</p>
            </div>
          )}
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDProjects
