import { motion } from 'framer-motion'
import { Check, RotateCcw, Search, Send, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Card from './ui/Card'
import DemoNotice from './ui/DemoNotice'
import EmptyState from './ui/EmptyState'

const STORAGE_KEY = 'alex-portfolio-project-manager'

const statuses = ['Planned', 'In Progress', 'Completed', 'On Hold']
const approvalStatuses = ['Pending Review', 'Approved', 'Rejected']
const visibilityOptions = ['Public', 'Private']
const priorities = ['Low', 'Medium', 'High']
const categories = ['API', 'Frontend', 'Database', 'Security', 'Tooling', 'Learning']

const technicalBadges = [
  'CRUD',
  'localStorage',
  'Client/Admin views',
  'Approval workflow',
  'Role-based UI',
  'Forms',
]

const sampleProjects = [
  {
    id: 'project-market-api-dashboard',
    title: 'Market API Dashboard',
    description:
      'Crypto market dashboard with API-style data, responsive cards and chart rendering.',
    clientName: 'Alex Gomez',
    clientEmail: 'alex.demo@example.com',
    technologies: ['React', 'API REST', 'Recharts'],
    category: 'API',
    priority: 'Medium',
    status: 'Completed',
    approvalStatus: 'Approved',
    visibility: 'Public',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-05-22T12:30:00.000Z',
    approvedAt: '2026-01-12T09:00:00.000Z',
    adminNotes: 'Approved as a public API dashboard example.',
    estimatedHours: '18',
    budgetRange: 'Portfolio demo',
  },
  {
    id: 'project-sql-query-playground',
    title: 'SQL Query Playground',
    description: 'Static SQL practice interface with prepared queries and table results.',
    clientName: 'Alex Gomez',
    clientEmail: 'alex.demo@example.com',
    technologies: ['React', 'SQL', 'Tables'],
    category: 'Database',
    priority: 'High',
    status: 'Completed',
    approvalStatus: 'Approved',
    visibility: 'Public',
    createdAt: '2026-02-08T09:30:00.000Z',
    updatedAt: '2026-05-27T15:20:00.000Z',
    approvedAt: '2026-02-10T11:00:00.000Z',
    adminNotes: 'Good database-focused demo for portfolio review.',
    estimatedHours: '14',
    budgetRange: 'Portfolio demo',
  },
  {
    id: 'project-secure-users-roles-demo',
    title: 'Secure Users & Roles Demo',
    description: 'Frontend user records demo with roles and protected password records.',
    clientName: 'Alex Gomez',
    clientEmail: 'alex.demo@example.com',
    technologies: ['React', 'localStorage', 'Role-based UI'],
    category: 'Security',
    priority: 'High',
    status: 'In Progress',
    approvalStatus: 'Approved',
    visibility: 'Public',
    createdAt: '2026-03-14T08:45:00.000Z',
    updatedAt: '2026-06-01T16:00:00.000Z',
    approvedAt: '2026-03-16T12:00:00.000Z',
    adminNotes: 'Educational security demo, not production authentication.',
    estimatedHours: '20',
    budgetRange: 'Portfolio demo',
  },
  {
    id: 'project-checkout-flow-simulator',
    title: 'Checkout Flow Simulator',
    description: 'A proposed frontend flow for validating cart and checkout states.',
    clientName: 'Demo Client',
    clientEmail: 'client@example.com',
    technologies: ['React', 'Forms', 'State'],
    category: 'Frontend',
    priority: 'Medium',
    status: 'Planned',
    approvalStatus: 'Pending Review',
    visibility: 'Private',
    createdAt: '2026-05-20T10:15:00.000Z',
    updatedAt: '2026-05-20T10:15:00.000Z',
    approvedAt: null,
    adminNotes: '',
    estimatedHours: '',
    budgetRange: 'Small demo',
  },
  {
    id: 'project-internal-admin-notes-tool',
    title: 'Internal Admin Notes Tool',
    description: 'A private tooling idea for keeping internal review notes organized.',
    clientName: 'Demo Client',
    clientEmail: 'client@example.com',
    technologies: ['React', 'Tooling'],
    category: 'Tooling',
    priority: 'Low',
    status: 'Planned',
    approvalStatus: 'Rejected',
    visibility: 'Private',
    createdAt: '2026-05-18T13:10:00.000Z',
    updatedAt: '2026-05-19T09:25:00.000Z',
    approvedAt: null,
    adminNotes: 'Rejected in demo review.',
    estimatedHours: '',
    budgetRange: 'Not specified',
  },
]

const emptyClientForm = {
  title: '',
  description: '',
  clientName: '',
  clientEmail: '',
  category: 'Frontend',
  technologies: '',
  budgetRange: '',
  priority: 'Medium',
}

const inputClass =
  'mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-950'

function normalizeChoice(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback
}

function normalizeTechnologies(value) {
  if (Array.isArray(value)) {
    const technologies = value.map((item) => String(item).trim()).filter(Boolean)
    return technologies.length > 0 ? technologies : ['React']
  }

  const technologies = String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return technologies.length > 0 ? technologies : ['React']
}

function normalizeProject(project, index = 0) {
  const now = new Date().toISOString()
  const approvalStatus = normalizeChoice(project.approvalStatus, approvalStatuses, 'Approved')

  return {
    id: project.id || `project-${index}-${Date.now()}`,
    title: project.title || 'Untitled project',
    description: project.description || 'No description provided.',
    clientName: project.clientName || 'Alex Gomez',
    clientEmail: project.clientEmail || 'demo@example.com',
    technologies: normalizeTechnologies(project.technologies),
    category: normalizeChoice(project.category, categories, 'Frontend'),
    priority: normalizeChoice(project.priority, priorities, 'Medium'),
    status: normalizeChoice(project.status, statuses, 'Planned'),
    approvalStatus,
    visibility: normalizeChoice(project.visibility, visibilityOptions, 'Public'),
    createdAt: project.createdAt || project.date || now,
    updatedAt: project.updatedAt || project.createdAt || now,
    approvedAt: project.approvedAt || (approvalStatus === 'Approved' ? project.createdAt || now : null),
    adminNotes: project.adminNotes || '',
    estimatedHours: project.estimatedHours || '',
    budgetRange: project.budgetRange || 'Not specified',
  }
}

function getInitialProjects() {
  try {
    const storedProjects = window.localStorage.getItem(STORAGE_KEY)
    if (!storedProjects) return sampleProjects

    const parsedProjects = JSON.parse(storedProjects)
    return Array.isArray(parsedProjects)
      ? parsedProjects.map(normalizeProject).sort(sortByUpdatedAt)
      : sampleProjects
  } catch {
    return sampleProjects
  }
}

function sortByUpdatedAt(a, b) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

function formatDate(value) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getBadgeTone(value) {
  const tones = {
    Approved: 'green',
    Rejected: 'neutral',
    'Pending Review': 'violet',
    Completed: 'green',
    'In Progress': 'cyan',
    Planned: 'blue',
    'On Hold': 'neutral',
    Public: 'green',
    Private: 'neutral',
    High: 'violet',
    Medium: 'blue',
    Low: 'neutral',
  }

  return tones[value] || 'neutral'
}

function ProjectManagerDemo() {
  const [projects, setProjects] = useState(getInitialProjects)
  const [activeView, setActiveView] = useState('client')
  const [clientForm, setClientForm] = useState(emptyClientForm)
  const [clientErrors, setClientErrors] = useState({})
  const [clientMessage, setClientMessage] = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [clientCategory, setClientCategory] = useState('All')
  const [adminSearch, setAdminSearch] = useState('')
  const [adminApproval, setAdminApproval] = useState('All')
  const [adminStatus, setAdminStatus] = useState('All')
  const [adminCategory, setAdminCategory] = useState('All')
  const [adminPriority, setAdminPriority] = useState('All')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const publicProjects = useMemo(() => {
    const search = clientSearch.trim().toLowerCase()

    return projects
      .filter(
        (project) =>
          project.approvalStatus === 'Approved' && project.visibility === 'Public',
      )
      .filter((project) => {
        const matchesSearch = !search || project.title.toLowerCase().includes(search)
        const matchesCategory = clientCategory === 'All' || project.category === clientCategory

        return matchesSearch && matchesCategory
      })
      .sort(sortByUpdatedAt)
  }, [clientCategory, clientSearch, projects])

  const adminProjects = useMemo(() => {
    const search = adminSearch.trim().toLowerCase()

    return projects
      .filter((project) => {
        const matchesSearch =
          !search ||
          project.title.toLowerCase().includes(search) ||
          project.clientName.toLowerCase().includes(search) ||
          project.clientEmail.toLowerCase().includes(search)
        const matchesApproval =
          adminApproval === 'All' || project.approvalStatus === adminApproval
        const matchesStatus = adminStatus === 'All' || project.status === adminStatus
        const matchesCategory = adminCategory === 'All' || project.category === adminCategory
        const matchesPriority = adminPriority === 'All' || project.priority === adminPriority

        return (
          matchesSearch &&
          matchesApproval &&
          matchesStatus &&
          matchesCategory &&
          matchesPriority
        )
      })
      .sort(sortByUpdatedAt)
  }, [adminApproval, adminCategory, adminPriority, adminSearch, adminStatus, projects])

  const summary = useMemo(
    () => ({
      total: projects.length,
      pending: projects.filter((project) => project.approvalStatus === 'Pending Review').length,
      approved: projects.filter((project) => project.approvalStatus === 'Approved').length,
      rejected: projects.filter((project) => project.approvalStatus === 'Rejected').length,
      public: projects.filter((project) => project.visibility === 'Public').length,
      completed: projects.filter((project) => project.status === 'Completed').length,
    }),
    [projects],
  )

  function updateClientForm(field, value) {
    setClientForm((current) => ({ ...current, [field]: value }))
  }

  function validateClientForm() {
    const errors = {}
    const email = clientForm.clientEmail.trim()

    if (!clientForm.title.trim()) errors.title = 'Project title is required.'
    if (!clientForm.description.trim()) errors.description = 'Description is required.'
    if (!clientForm.clientName.trim()) errors.clientName = 'Client name is required.'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.clientEmail = 'Use a valid email address.'
    }
    if (!clientForm.category) errors.category = 'Category is required.'

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  function submitClientProject(event) {
    event.preventDefault()
    setClientMessage('')

    if (!validateClientForm()) return

    const now = new Date().toISOString()
    const technologies = normalizeTechnologies(clientForm.technologies || 'React')

    setProjects((current) => [
      normalizeProject({
        id: `project-${Date.now()}`,
        title: clientForm.title.trim(),
        description: clientForm.description.trim(),
        clientName: clientForm.clientName.trim(),
        clientEmail: clientForm.clientEmail.trim().toLowerCase(),
        technologies,
        category: clientForm.category,
        priority: clientForm.priority,
        status: 'Planned',
        approvalStatus: 'Pending Review',
        visibility: 'Private',
        createdAt: now,
        updatedAt: now,
        approvedAt: null,
        adminNotes: '',
        estimatedHours: '',
        budgetRange: clientForm.budgetRange.trim() || 'Not specified',
      }),
      ...current,
    ])

    setClientForm(emptyClientForm)
    setClientErrors({})
    setClientMessage('Your project proposal was submitted and is waiting for admin approval.')
    window.setTimeout(() => setClientMessage(''), 3500)
  }

  function resetDemoData() {
    setProjects(sampleProjects)
    setClientForm(emptyClientForm)
    setClientErrors({})
    setClientMessage('')
    setClientSearch('')
    setClientCategory('All')
    setAdminSearch('')
    setAdminApproval('All')
    setAdminStatus('All')
    setAdminCategory('All')
    setAdminPriority('All')
  }

  function updateProject(id, updates) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project,
      ),
    )
  }

  function approveProject(project) {
    updateProject(project.id, {
      approvalStatus: 'Approved',
      visibility: 'Public',
      approvedAt: new Date().toISOString(),
    })
  }

  function rejectProject(project) {
    updateProject(project.id, {
      approvalStatus: 'Rejected',
      visibility: 'Private',
      adminNotes: project.adminNotes.trim() || 'Rejected in demo review.',
    })
  }

  function deleteProject(id) {
    setProjects((current) => current.filter((project) => project.id !== id))
  }

  return (
    <motion.section
      id="project-manager"
      aria-labelledby="project-manager-title"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
              State Management Demo
            </p>
            <h3
              id="project-manager-title"
              className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white"
            >
              Client / Admin Project Board
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              A project management demo with client submissions, admin approval
              flow, status updates and localStorage persistence.
            </p>
            <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
              I built this demo to practice how the same data can be shown
              differently depending on the user role. Clients can submit project
              ideas, while the admin can review, approve and manage their status.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {technicalBadges.map((badge) => (
                <Badge key={badge} tone="blue">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <Card className="grid grid-cols-2 gap-3 p-4 sm:min-w-72">
            <SummaryMini label="Projects" value={summary.total} />
            <SummaryMini label="Pending" value={summary.pending} accent />
          </Card>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:p-8">
        <Card className="p-5">
          <h4 className="text-lg font-bold text-slate-950 dark:text-white">
            Demo workflow
          </h4>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            This demo simulates a common approval workflow: client submissions
            stay private until an admin reviews and approves them.
          </p>
        </Card>

        <DemoNotice>
          This is a local educational demo. Client submissions are stored only
          in your browser unless a real backend is connected.
        </DemoNotice>

        <div className="flex flex-wrap gap-2">
          {[
            ['client', 'Client View'],
            ['admin', 'Admin View'],
          ].map(([view, label]) => (
            <Button
              key={view}
              onClick={() => setActiveView(view)}
              size="small"
              variant={activeView === view ? 'primary' : 'secondary'}
            >
              {label}
            </Button>
          ))}
          <Button onClick={resetDemoData} size="small">
            <RotateCcw size={15} />
            Reset demo data
          </Button>
        </div>

        {activeView === 'client' ? (
          <ClientView
            category={clientCategory}
            errors={clientErrors}
            form={clientForm}
            message={clientMessage}
            projects={publicProjects}
            search={clientSearch}
            onCategoryChange={setClientCategory}
            onFormChange={updateClientForm}
            onSearchChange={setClientSearch}
            onSubmit={submitClientProject}
          />
        ) : (
          <AdminView
            approval={adminApproval}
            category={adminCategory}
            priority={adminPriority}
            projects={adminProjects}
            search={adminSearch}
            status={adminStatus}
            summary={summary}
            onApprovalChange={setAdminApproval}
            onApprove={approveProject}
            onCategoryChange={setAdminCategory}
            onDelete={deleteProject}
            onPriorityChange={setAdminPriority}
            onReject={rejectProject}
            onSearchChange={setAdminSearch}
            onStatusChange={setAdminStatus}
            onUpdate={updateProject}
          />
        )}
      </div>
    </motion.section>
  )
}

function SummaryMini({ label, value, accent = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${accent ? 'text-blue-700 dark:text-sky-300' : 'text-slate-950 dark:text-white'}`}>
        {value}
      </p>
    </div>
  )
}

function Field({ children, error, label }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-600 dark:text-rose-300">{error}</span>}
    </label>
  )
}

function SelectField({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  )
}

function ClientView({
  category,
  errors,
  form,
  message,
  projects,
  search,
  onCategoryChange,
  onFormChange,
  onSearchChange,
  onSubmit,
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card as="form" className="p-5" onSubmit={onSubmit}>
        <div className="mb-5">
          <h4 className="text-lg font-bold text-slate-950 dark:text-white">
            Submit project proposal
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            New client submissions start as private and wait for admin approval.
          </p>
        </div>

        {message && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            {message}
          </p>
        )}

        <div className="grid gap-4">
          <Field label="Project title" error={errors.title}>
            <input
              value={form.title}
              onChange={(event) => onFormChange('title', event.target.value)}
              placeholder="Project name"
              className={inputClass}
            />
          </Field>
          <Field label="Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(event) => onFormChange('description', event.target.value)}
              placeholder="What should this project do?"
              className={`${inputClass} min-h-24 resize-y`}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client name" error={errors.clientName}>
              <input
                value={form.clientName}
                onChange={(event) => onFormChange('clientName', event.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </Field>
            <Field label="Client email" error={errors.clientEmail}>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(event) => onFormChange('clientEmail', event.target.value)}
                placeholder="client@example.com"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Category"
              value={form.category}
              options={categories}
              onChange={(value) => onFormChange('category', value)}
            />
            <SelectField
              label="Priority"
              value={form.priority}
              options={priorities}
              onChange={(value) => onFormChange('priority', value)}
            />
          </div>
          <Field label="Technologies">
            <input
              value={form.technologies}
              onChange={(event) => onFormChange('technologies', event.target.value)}
              placeholder="React, SQL, APIs"
              className={inputClass}
            />
          </Field>
          <Field label="Budget range">
            <input
              value={form.budgetRange}
              onChange={(event) => onFormChange('budgetRange', event.target.value)}
              placeholder="Small demo, 1-2 weeks..."
              className={inputClass}
            />
          </Field>
          <Button type="submit" variant="primary">
            <Send size={17} />
            Submit proposal
          </Button>
        </div>
      </Card>

      <div className="space-y-5">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] dark:border-slate-800 dark:bg-slate-900">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search approved public projects"
          />
          <FilterSelect
            value={category}
            options={['All', ...categories]}
            onChange={onCategoryChange}
            label="Filter by category"
          />
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No public projects"
            text="Approved public projects will appear here."
          />
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-950 dark:text-white">
                      {project.title}
                    </h4>
                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Badge tone={getBadgeTone(project.status)}>{project.status}</Badge>
                    <Badge tone={getBadgeTone(project.category)}>{project.category}</Badge>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <Badge key={technology} tone="neutral">
                      {technology}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-widest text-slate-400">
                  Updated {formatDate(project.updatedAt)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminView({
  approval,
  category,
  priority,
  projects,
  search,
  status,
  summary,
  onApprovalChange,
  onApprove,
  onCategoryChange,
  onDelete,
  onPriorityChange,
  onReject,
  onSearchChange,
  onStatusChange,
  onUpdate,
}) {
  return (
      <div className="space-y-5">
      <DemoNotice>
        Admin controls are simulated for portfolio purposes.
      </DemoNotice>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          ['Total projects', summary.total],
          ['Pending review', summary.pending],
          ['Approved projects', summary.approved],
          ['Rejected projects', summary.rejected],
          ['Public projects', summary.public],
          ['Completed projects', summary.completed],
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
        {summary.pending > 0
          ? `You have ${summary.pending} project proposal(s) waiting for approval.`
          : 'No projects waiting for review.'}
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5 dark:border-slate-800 dark:bg-slate-900">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search title, client or email"
        />
        <FilterSelect
          label="Approval"
          value={approval}
          options={['All', ...approvalStatuses]}
          onChange={onApprovalChange}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={['All', ...statuses]}
          onChange={onStatusChange}
        />
        <FilterSelect
          label="Category"
          value={category}
          options={['All', ...categories]}
          onChange={onCategoryChange}
        />
        <FilterSelect
          label="Priority"
          value={priority}
          options={['All', ...priorities]}
          onChange={onPriorityChange}
        />
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No admin results" text="Try another search or filter." />
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-950 dark:text-white">
                      {project.title}
                    </h4>
                    <Badge tone={getBadgeTone(project.approvalStatus)}>
                      {project.approvalStatus}
                    </Badge>
                    <Badge tone={getBadgeTone(project.visibility)}>{project.visibility}</Badge>
                    <Badge tone={getBadgeTone(project.priority)}>{project.priority}</Badge>
                  </div>
                  <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                    {project.description}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">
                    <p>
                      <span className="font-semibold">Client:</span> {project.clientName}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {project.clientEmail}
                    </p>
                    <p>
                      <span className="font-semibold">Created:</span>{' '}
                      {formatDate(project.createdAt)}
                    </p>
                    <p>
                      <span className="font-semibold">Approved:</span>{' '}
                      {formatDate(project.approvedAt)}
                    </p>
                    <p>
                      <span className="font-semibold">Budget:</span> {project.budgetRange}
                    </p>
                    <p>
                      <span className="font-semibold">Hours:</span>{' '}
                      {project.estimatedHours || 'Not estimated'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  {project.approvalStatus === 'Pending Review' && (
                    <>
                      <Button onClick={() => onApprove(project)} size="small" variant="primary">
                        <Check size={15} />
                        Approve
                      </Button>
                      <Button onClick={() => onReject(project)} size="small">
                        <X size={15} />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button onClick={() => onDelete(project.id)} size="small">
                    <Trash2 size={15} />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SelectField
                  label="Status"
                  value={project.status}
                  options={statuses}
                  onChange={(value) => onUpdate(project.id, { status: value })}
                />
                <SelectField
                  label="Visibility"
                  value={project.visibility}
                  options={visibilityOptions}
                  onChange={(value) => onUpdate(project.id, { visibility: value })}
                />
                <SelectField
                  label="Priority"
                  value={project.priority}
                  options={priorities}
                  onChange={(value) => onUpdate(project.id, { priority: value })}
                />
                <Field label="Estimated hours">
                  <input
                    value={project.estimatedHours}
                    onChange={(event) =>
                      onUpdate(project.id, { estimatedHours: event.target.value })
                    }
                    className={inputClass}
                    placeholder="12"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <Field label="Admin notes">
                  <textarea
                    value={project.adminNotes}
                    onChange={(event) =>
                      onUpdate(project.id, { adminNotes: event.target.value })
                    }
                    className={`${inputClass} min-h-24 resize-y`}
                    placeholder="Internal review notes"
                  />
                </Field>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Technologies
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <Badge key={technology} tone="neutral">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-widest text-slate-400">
                    Last updated {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-950"
      />
    </label>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'All' ? label : option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default ProjectManagerDemo
