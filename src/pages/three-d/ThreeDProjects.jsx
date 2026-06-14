import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'
import { moveRenderCategoryLast } from '../../utils/threeDCategoryOrder'

const filters = moveRenderCategoryLast(['All', 'Props', 'Environments', 'Materials', 'Game Ready', 'Projects Render'])

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
    'Game Ready': ['real-time', 'realtime', 'game-ready', 'game ready', 'engine', 'optimized'],
    'Projects Render': ['projects render', 'project renders', 'renders', 'render projects', 'render'],
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
      <section className="px-4 py-10 sm:px-5 sm:py-14">
        <div className="mx-auto max-w-[92rem]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#111214] px-5 py-8 shadow-2xl shadow-black/30 sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.08),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(249,115,22,0.035),transparent_28%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                to="/3d"
                className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.045] px-3 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.075] hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-200/40"
              >
                <ArrowLeft size={14} /> Home Page
              </Link>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-teal-200/80">Artwork gallery</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-50 sm:text-6xl">Projects</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Props, environments, material studies and real-time presentation work built around clean game-art workflows.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/[0.08] bg-black/35 p-3 shadow-xl backdrop-blur lg:max-w-2xl">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="sr-only" htmlFor="three-d-search">Search artworks</label>
                <input
                  id="three-d-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by artwork, tool or tag"
                  className="min-h-10 rounded-xl border border-white/[0.08] bg-[#070809] px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-teal-200/45"
                />
                <label className="flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#070809] px-3 text-xs font-bold text-zinc-300">
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
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      activeFilter === filter
                        ? 'border-zinc-200 bg-zinc-100 text-[#070809] shadow-lg shadow-white/10'
                        : 'border-white/[0.08] bg-white/[0.035] text-zinc-400 hover:border-white/18 hover:bg-white/[0.065] hover:text-zinc-100'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            </div>
          </div>

          {filteredProjects.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
