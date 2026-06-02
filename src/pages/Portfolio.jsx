import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import GitHubProjectsExplorer from '../components/GitHubProjectsExplorer'
import MarketDashboard from '../components/MarketDashboard'
import ProjectCard from '../components/ProjectCard'
import ProjectManagerDemo from '../components/ProjectManagerDemo'
import SectionTitle from '../components/SectionTitle'
import WeatherSearchDemo from '../components/WeatherSearchDemo'
import { projects } from '../data/projects'

const demoIndex = [
  {
    title: 'Market API Dashboard',
    label: 'External API + Data Visualization',
    href: '#market-dashboard',
  },
  {
    title: 'Project Manager CRUD',
    label: 'CRUD + localStorage',
    href: '#project-manager',
  },
  {
    title: 'Weather Search App',
    label: 'Forms + API-ready architecture',
    href: '#weather-search',
  },
  {
    title: 'GitHub Projects Explorer',
    label: 'Public API + Filtering',
    href: '#github-explorer',
  },
]

const typeFilters = ['All', ...Array.from(new Set(projects.map((project) => project.type)))]
const statusFilters = [
  'All',
  ...Array.from(new Set(projects.map((project) => project.status))),
]

function DemoIntro({ eyebrow, title, description }) {
  return (
    <div className="mb-5 rounded-md border border-white/10 bg-slate-950/60 p-5">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-bold tracking-normal text-white">
        {title}
      </h3>
      <p className="mt-2 leading-7 text-slate-300">{description}</p>
    </div>
  )
}

function Portfolio() {
  const [projectSearch, setProjectSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const completedProjects = projects.filter(
    (project) => project.status === 'Completed',
  ).length
  const apiDemos = projects.filter((project) => project.type === 'API Demo').length
  const frontendDemos = projects.filter((project) =>
    project.type.includes('Frontend'),
  ).length

  const filteredProjects = useMemo(() => {
    const normalizedSearch = projectSearch.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch = [
        project.title,
        project.description,
        project.type,
        project.status,
        project.technologies.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

      const matchesType = typeFilter === 'All' || project.type === typeFilter
      const matchesStatus =
        statusFilter === 'All' || project.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [projectSearch, statusFilter, typeFilter])

  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="Portfolio"
          title="Technical Projects & Interactive Demos"
          description="A collection of practical projects focused on APIs, state management, forms, data visualization, routing and reusable UI."
        />

        <nav
          className="mb-12 grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 md:grid-cols-2 xl:grid-cols-4"
          aria-label="Portfolio demos"
        >
          {demoIndex.map((demo) => (
            <a
              key={demo.href}
              href={demo.href}
              className="rounded-md border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <p className="text-sm font-semibold text-cyan-200">{demo.label}</p>
              <p className="mt-1 font-bold text-white">{demo.title}</p>
            </a>
          ))}
        </nav>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Case studies', value: projects.length },
            { label: 'Completed', value: completedProjects },
            { label: 'Technical demos', value: apiDemos + frontendDemos },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-16">
          <section aria-label="Market API Dashboard demo">
            <DemoIntro
              eyebrow="External API + Data Visualization"
              title="Live data, loading states and chart rendering"
              description="A compact dashboard that demonstrates fetching external data, formatting values and keeping the UI useful while data is loading or unavailable."
            />
            <MarketDashboard />
          </section>

          <section aria-label="Project Manager CRUD demo">
            <DemoIntro
              eyebrow="CRUD + localStorage"
              title="Forms, filters and persistent local state"
              description="A local project manager that keeps create, edit, delete and filtering logic visible without hiding everything behind a backend."
            />
            <ProjectManagerDemo />
          </section>

          <section aria-label="Weather Search App demo">
            <DemoIntro
              eyebrow="Forms + API-ready architecture"
              title="Validation, service separation and fallback data"
              description="A weather lookup interface prepared for OpenWeatherMap, while still working with mock data when no API key is configured."
            />
            <WeatherSearchDemo />
          </section>

          <section aria-label="GitHub Projects Explorer demo">
            <DemoIntro
              eyebrow="Public API + Filtering"
              title="Repository data with search, filters and sorting"
              description="A GitHub repository explorer that normalizes public API data and gracefully falls back when the service is unavailable."
            />
            <GitHubProjectsExplorer />
          </section>

          <section aria-labelledby="project-gallery-title">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Project Gallery
              </p>
              <h3
                id="project-gallery-title"
                className="mt-2 text-2xl font-bold tracking-normal text-white sm:text-3xl"
              >
                Case-study style project pages
              </h3>
              <p className="mt-2 max-w-3xl leading-7 text-slate-300">
                Each card links to a more detailed breakdown of the features,
                technical decisions, challenges and possible improvements.
              </p>
            </div>

            <div className="mb-6 grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 lg:grid-cols-[1fr_auto_auto]">
              <label className="relative block">
                <span className="sr-only">Search projects</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  value={projectSearch}
                  onChange={(event) => setProjectSearch(event.target.value)}
                  placeholder="Search projects, stack or type"
                  className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block lg:min-w-48">
                <span className="sr-only">Filter projects by type</span>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                >
                  {typeFilters.map((type) => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All types' : type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block lg:min-w-48">
                <span className="sr-only">Filter projects by status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                >
                  {statusFilters.map((status) => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'All statuses' : status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                No projects match the current filters.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
