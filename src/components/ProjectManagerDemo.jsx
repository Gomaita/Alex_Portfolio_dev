import { motion } from 'framer-motion'
import { Pencil, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'alex-portfolio-project-manager'

const technicalBadges = ['React State', 'Forms', 'CRUD', 'localStorage', 'Filtering']

const statusStyles = {
  Completed: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
  'In Progress': 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  Planned: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
}

const sampleProjects = [
  {
    id: 'project-market-api-dashboard',
    title: 'Market API Dashboard',
    description:
      'Crypto market dashboard consuming an external API and rendering responsive data cards and charts.',
    technologies: ['React', 'API REST', 'Recharts', 'async/await'],
    status: 'Completed',
    date: '2026',
  },
  {
    id: 'project-manager-crud',
    title: 'Project Manager CRUD',
    description:
      'Local project management demo with create, edit, delete, filters and persistent storage.',
    technologies: ['React', 'Forms', 'localStorage', 'State'],
    status: 'In Progress',
    date: '2026',
  },
  {
    id: 'project-weather-search-app',
    title: 'Weather Search App',
    description:
      'Weather search interface prepared for external API integration and dynamic UI states.',
    technologies: ['React', 'API REST', 'Forms', 'Error Handling'],
    status: 'Planned',
    date: '2026',
  },
  {
    id: 'project-portfolio-website',
    title: 'Portfolio Website',
    description:
      'Personal portfolio built with React, routing, animations and reusable components.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    status: 'Completed',
    date: '2026',
  },
]

const emptyForm = {
  title: '',
  description: '',
  technologies: '',
  status: 'In Progress',
  date: '2026',
}

function normalizeStatus(status) {
  const normalizedStatus = String(status || '').toLowerCase()

  if (normalizedStatus === 'completed') {
    return 'Completed'
  }

  if (normalizedStatus === 'planned') {
    return 'Planned'
  }

  return 'In Progress'
}

function normalizeProject(project, index) {
  return {
    id: project.id || `stored-project-${index}`,
    title: project.title || 'Untitled Project',
    description: project.description || 'No description provided.',
    technologies:
      Array.isArray(project.technologies) && project.technologies.length > 0
        ? project.technologies
        : ['React'],
    status: normalizeStatus(project.status),
    date: project.date || '2026',
  }
}

function getInitialProjects() {
  try {
    const storedProjects = window.localStorage.getItem(STORAGE_KEY)
    return storedProjects
      ? JSON.parse(storedProjects).map(normalizeProject)
      : sampleProjects
  } catch {
    return sampleProjects
  }
}

function ProjectManagerDemo() {
  const [projects, setProjects] = useState(getInitialProjects)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [technologyFilter, setTechnologyFilter] = useState('all')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const availableTechnologies = useMemo(() => {
    const technologies = projects.flatMap((project) => project.technologies)
    return ['all', ...Array.from(new Set(technologies)).sort()]
  }, [projects])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(normalizedSearch)
      const matchesTechnology =
        technologyFilter === 'all' || project.technologies.includes(technologyFilter)

      return matchesSearch && matchesTechnology
    })
  }, [projects, searchQuery, technologyFilter])

  const completedCount = projects.filter((project) => project.status === 'Completed').length

  function handleFieldChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setFormError('')
  }

  function resetSampleData() {
    setProjects(sampleProjects)
    setSearchQuery('')
    setTechnologyFilter('all')
    resetForm()
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setFormError('Please add a project title.')
      return
    }

    if (!form.description.trim()) {
      setFormError('Please add a short project description.')
      return
    }

    const technologies = form.technologies
      .split(',')
      .map((technology) => technology.trim())
      .filter(Boolean)

    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: technologies.length > 0 ? technologies : ['React'],
      status: form.status,
      date: form.date.trim() || '2026',
    }

    if (editingId) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingId ? { ...project, ...projectData } : project,
        ),
      )
    } else {
      setProjects((currentProjects) => [
        {
          id: `project-${Date.now()}`,
          ...projectData,
        },
        ...currentProjects,
      ])
    }

    resetForm()
  }

  function handleEdit(project) {
    setEditingId(project.id)
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      status: project.status,
      date: project.date,
    })
    setFormError('')
  }

  function handleDelete(projectId) {
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId),
    )

    if (editingId === projectId) {
      resetForm()
    }
  }

  function updateStatus(projectId, status) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId ? { ...project, status } : project,
      ),
    )
  }

  return (
    <motion.section
      id="project-manager"
      aria-labelledby="project-manager-title"
      className="mb-16 overflow-hidden rounded-md border border-cyan-300/15 bg-slate-950/70 shadow-2xl shadow-slate-950/40"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              State Management Demo
            </p>
            <h3
              id="project-manager-title"
              className="mt-3 text-3xl font-bold tracking-normal text-white sm:text-4xl"
            >
              Project Manager CRUD
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              A local project management demo that shows React state handling,
              form validation, CRUD operations, filtering and localStorage
              persistence.
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

          <div className="grid grid-cols-2 gap-3 rounded-md border border-white/10 bg-white/[0.04] p-4 sm:min-w-64">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Projects
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{projects.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Completed
              </p>
              <p className="mt-2 text-2xl font-bold text-cyan-200">
                {completedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <form
          className="rounded-md border border-white/10 bg-slate-950/60 p-5"
          onSubmit={handleSubmit}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-lg font-semibold text-white">
              {editingId ? 'Edit project' : 'Create project'}
            </h4>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          {formError && (
            <p
              className="mb-4 rounded-md border border-red-300/25 bg-red-300/10 px-3 py-2 text-sm text-red-100"
              role="alert"
            >
              {formError}
            </p>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleFieldChange}
                placeholder="Project name"
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFieldChange}
                placeholder="Short project summary"
                className="mt-2 min-h-24 w-full resize-y rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Technologies</span>
              <input
                name="technologies"
                value={form.technologies}
                onChange={handleFieldChange}
                placeholder="React, Forms, localStorage"
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              />
              <span className="mt-1 block text-xs text-slate-500">
                Separate technologies with commas. Empty values default to React.
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFieldChange}
                  className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Planned">Planned</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-200">Date</span>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleFieldChange}
                  placeholder="2026"
                  className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Plus size={18} />
                {editingId ? 'Save changes' : 'Create project'}
              </button>
              <button
                type="button"
                onClick={resetSampleData}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <RotateCcw size={17} />
                Reset
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-5">
          <div className="grid gap-3 rounded-md border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search projects by name</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by project name"
                className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              />
            </label>

            <label className="block sm:min-w-52">
              <span className="sr-only">Filter projects by technology</span>
              <select
                value={technologyFilter}
                onChange={(event) => setTechnologyFilter(event.target.value)}
                className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              >
                {availableTechnologies.map((technology) => (
                  <option key={technology} value={technology}>
                    {technology === 'all' ? 'All technologies' : technology}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-4" aria-live="polite">
            {filteredProjects.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-slate-950/60 p-6 text-center text-sm leading-6 text-slate-400">
                No projects match the current search or filter.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-md border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-300/40 hover:bg-slate-900/80"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{project.title}</h4>
                        <span
                          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusStyles[project.status]}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{project.date}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        aria-label={`Change status for ${project.title}`}
                        value={project.status}
                        onChange={(event) => updateStatus(project.id, event.target.value)}
                        className="min-h-9 rounded-md border border-white/15 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Planned">Planned</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="inline-flex min-h-9 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex min-h-9 items-center gap-2 rounded-md border border-red-300/25 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-300/10 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 leading-7 text-slate-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-xs font-semibold text-violet-100"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ProjectManagerDemo
