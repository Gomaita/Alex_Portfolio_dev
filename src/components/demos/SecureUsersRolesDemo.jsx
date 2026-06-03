import { Copy, Eye, EyeOff, RotateCcw, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  availableRoles,
  availableStatuses,
  initialSecureUsers,
  secureUsersStorageKey,
  securityDemoNote,
  suggestedSkills,
} from '../../data/secureUsersDemoData'
import { createPasswordRecord, generateDemoPasswordHashIfNeeded, maskHash } from '../../services/cryptoService'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Card from '../ui/Card'
import DemoNotice from '../ui/DemoNotice'
import EmptyState from '../ui/EmptyState'

const initialForm = {
  name: '',
  email: '',
  role: 'Developer',
  location: '',
  password: '',
  skills: '',
  publicProfile: true,
}

const demoBadges = [
  'React Forms',
  'localStorage',
  'Role-based UI',
  'Password Hashing',
  'Data Tables',
]

function formatDate(value) {
  if (!value || value === 'Never') return value || 'Not available'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getSkills(value) {
  const skills = value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  return skills.length > 0 ? skills : ['Learning']
}

function getRiskBadge(user) {
  if (user.status === 'Suspended') return { label: 'Blocked', tone: 'neutral' }
  if (user.status === 'Pending') return { label: 'Review', tone: 'violet' }
  if (user.status === 'Active' && user.publicProfile) return { label: 'Low', tone: 'green' }
  return { label: 'Limited', tone: 'blue' }
}

function shortId(id) {
  return id.replace('usr-', '').slice(0, 10)
}

function SecureUsersRolesDemo() {
  const [users, setUsers] = useState([])
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false)
  const [activeView, setActiveView] = useState('client')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [clientRole, setClientRole] = useState('All')
  const [clientSkill, setClientSkill] = useState('All')
  const [moderatorSearch, setModeratorSearch] = useState('')
  const [moderatorRole, setModeratorRole] = useState('All')
  const [moderatorStatus, setModeratorStatus] = useState('All')
  const [visibleHashes, setVisibleHashes] = useState({})
  const [copiedId, setCopiedId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      const saved = window.localStorage.getItem(secureUsersStorageKey)
      let source = initialSecureUsers

      if (saved) {
        try {
          const parsedUsers = JSON.parse(saved)
          source = Array.isArray(parsedUsers) ? parsedUsers : initialSecureUsers
        } catch {
          source = initialSecureUsers
        }
      }

      const preparedUsers = await Promise.all(source.map(generateDemoPasswordHashIfNeeded))

      if (isMounted) {
        setUsers(preparedUsers)
        setHasLoadedUsers(true)
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (hasLoadedUsers) {
      window.localStorage.setItem(secureUsersStorageKey, JSON.stringify(users))
    }
  }, [hasLoadedUsers, users])

  const skillFilters = useMemo(() => {
    const skills = new Set(users.flatMap((user) => user.skills))
    return ['All', ...Array.from(skills).sort()]
  }, [users])

  const clientUsers = useMemo(() => {
    const search = clientSearch.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch = !search || user.name.toLowerCase().includes(search)
      const matchesRole = clientRole === 'All' || user.role === clientRole
      const matchesSkill = clientSkill === 'All' || user.skills.includes(clientSkill)

      return matchesSearch && matchesRole && matchesSkill
    })
  }, [clientRole, clientSearch, clientSkill, users])

  const moderatorUsers = useMemo(() => {
    const search = moderatorSearch.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      const matchesRole = moderatorRole === 'All' || user.role === moderatorRole
      const matchesStatus = moderatorStatus === 'All' || user.status === moderatorStatus

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [moderatorRole, moderatorSearch, moderatorStatus, users])

  const summary = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === 'Active').length,
      pending: users.filter((user) => user.status === 'Pending').length,
      publicProfiles: users.filter((user) => user.publicProfile).length,
      protectedRecords: users.filter((user) => user.passwordHash && user.salt).length,
    }),
    [users],
  )

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    const nextErrors = {}
    const email = form.email.trim().toLowerCase()

    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!email) nextErrors.email = 'Email is required.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Use a valid email format.'
    }
    if (users.some((user) => user.email.toLowerCase() === email)) {
      nextErrors.email = 'This email already exists in the demo.'
    }
    if (!form.role) nextErrors.role = 'Role is required.'
    if (!form.password) nextErrors.password = 'Password is required.'
    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!validateForm()) return

    setIsCreating(true)
    const passwordRecord = await createPasswordRecord(form.password)
    const now = new Date().toISOString()

    setUsers((currentUsers) => [
      {
        id: `usr-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        status: 'Pending',
        location: form.location.trim() || 'Not specified',
        skills: getSkills(form.skills),
        publicProfile: form.publicProfile,
        createdAt: now,
        lastLogin: 'Never',
        internalNote: 'Created from the educational frontend demo.',
        ...passwordRecord,
      },
      ...currentUsers,
    ])
    setForm(initialForm)
    setErrors({})
    setMessage('User created. The original password was not stored or displayed.')
    setIsCreating(false)
  }

  async function resetDemoData() {
    const preparedUsers = await Promise.all(initialSecureUsers.map(generateDemoPasswordHashIfNeeded))
    setUsers(preparedUsers)
    setVisibleHashes({})
    setMessage('Demo data reset.')
  }

  function updateUser(id, field, value) {
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === id ? { ...user, [field]: value } : user)),
    )
  }

  function deleteUser(id) {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id))
  }

  async function copyHash(user) {
    if (!navigator.clipboard) return

    await navigator.clipboard.writeText(user.passwordHash)
    setCopiedId(user.id)
    window.setTimeout(() => setCopiedId(''), 1200)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-800/60">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
          Security + database demo
        </p>
        <h3 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          Secure Users & Roles Demo
        </h3>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          A user management demo that combines local data storage, role-based
          views and password hashing concepts.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {demoBadges.map((badge) => (
            <Badge key={badge} tone="neutral">
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6">
        <DemoNotice>
          This demo explains user records and password hashing concepts. It is
          not a real authentication system. Real apps should handle
          authentication, authorization and password hashing on the backend.
        </DemoNotice>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          {securityDemoNote}
        </div>

        <Card as="form" className="p-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-xl font-bold text-slate-950 dark:text-white">
                Create demo user
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                I built this to practice user records, roles and password
                hashing concepts. The password is used to create a protected
                record and then cleared.
              </p>
            </div>
            <Button type="submit" variant="primary" disabled={isCreating}>
              <UserPlus size={17} />
              {isCreating ? 'Creating...' : 'Create user'}
            </Button>
          </div>

          {message && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
              {message}
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Name" error={errors.name}>
              <input
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                className={inputClass}
                placeholder="Demo user name"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateForm('email', event.target.value)}
                className={inputClass}
                placeholder="demo@example.com"
              />
            </Field>
            <Field label="Role" error={errors.role}>
              <select
                value={form.role}
                onChange={(event) => updateForm('role', event.target.value)}
                className={inputClass}
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <input
                value={form.location}
                onChange={(event) => updateForm('location', event.target.value)}
                className={inputClass}
                placeholder="City, Country"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateForm('password', event.target.value)}
                className={inputClass}
                placeholder="At least 8 characters"
              />
            </Field>
            <Field label="Skills">
              <input
                value={form.skills}
                onChange={(event) => updateForm('skills', event.target.value)}
                className={inputClass}
                placeholder="React, SQL, APIs"
                list="secure-demo-skills"
              />
              <datalist id="secure-demo-skills">
                {suggestedSkills.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </Field>
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={form.publicProfile}
              onChange={(event) => updateForm('publicProfile', event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Public profile visible in Client View
          </label>
        </Card>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'client', label: 'Client View' },
            { id: 'moderator', label: 'Moderator View' },
          ].map((view) => (
            <Button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              size="small"
              variant={activeView === view.id ? 'primary' : 'secondary'}
            >
              {view.label}
            </Button>
          ))}
          <Button onClick={resetDemoData} size="small">
            <RotateCcw size={15} />
            Reset demo data
          </Button>
        </div>

        {activeView === 'client' ? (
          <ClientView
            role={clientRole}
            search={clientSearch}
            skill={clientSkill}
            skillFilters={skillFilters}
            users={clientUsers}
            onRoleChange={setClientRole}
            onSearchChange={setClientSearch}
            onSkillChange={setClientSkill}
          />
        ) : (
          <ModeratorView
            copiedId={copiedId}
            role={moderatorRole}
            search={moderatorSearch}
            status={moderatorStatus}
            summary={summary}
            users={moderatorUsers}
            visibleHashes={visibleHashes}
            onCopyHash={copyHash}
            onDeleteUser={deleteUser}
            onRoleChange={setModeratorRole}
            onSearchChange={setModeratorSearch}
            onStatusChange={setModeratorStatus}
            onToggleHash={(id) =>
              setVisibleHashes((current) => ({ ...current, [id]: !current[id] }))
            }
            onUpdateUser={updateUser}
          />
        )}

        <Card className="p-5">
          <h4 className="text-xl font-bold text-slate-950 dark:text-white">
            Why hashes instead of plain passwords?
          </h4>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            Passwords should not be stored as readable text. This demo stores a
            derived password record with a unique salt so the moderator can
            inspect the protected value without seeing the original password.
          </p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600 sm:grid-cols-2 dark:text-slate-300">
            {[
              'The original password is never shown after submission.',
              'Each user gets a unique salt.',
              'The moderator sees only the protected password record.',
              'In a real app, this belongs on the backend, not only in the browser.',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  )
}

const inputClass =
  'mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-950'

function Field({ children, error, label }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-600 dark:text-rose-300">{error}</span>}
    </label>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ClientView({
  role,
  search,
  skill,
  skillFilters,
  users,
  onRoleChange,
  onSearchChange,
  onSkillChange,
}) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Search by name">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className={inputClass}
            placeholder="Search public profiles"
          />
        </Field>
        <FilterSelect label="Role" value={role} options={['All', ...availableRoles]} onChange={onRoleChange} />
        <FilterSelect label="Skill" value={skill} options={skillFilters} onChange={onSkillChange} />
      </div>

      {users.length === 0 ? (
        <EmptyState title="No public results" text="Try another name, role or skill filter." />
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) =>
            user.publicProfile ? (
              <Card key={user.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-950 dark:text-white">{user.name}</h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.role}</p>
                  </div>
                  <Badge tone={user.status === 'Active' ? 'green' : 'violet'}>{user.status}</Badge>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{user.location}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.skills.map((item) => (
                    <Badge key={item} tone="neutral">
                      {item}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-widest text-slate-400">
                  Registered {formatDate(user.createdAt)}
                </p>
              </Card>
            ) : (
              <Card key={user.id} className="p-5">
                <Badge tone="neutral">Private profile</Badge>
                <h4 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">
                  Private profile
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  This user is hidden from public client data.
                </p>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  )
}

function ModeratorView({
  copiedId,
  role,
  search,
  status,
  summary,
  users,
  visibleHashes,
  onCopyHash,
  onDeleteUser,
  onRoleChange,
  onSearchChange,
  onStatusChange,
  onToggleHash,
  onUpdateUser,
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['Total users', summary.total],
          ['Active users', summary.active],
          ['Pending users', summary.pending],
          ['Public profiles', summary.publicProfiles],
          ['Password records protected', summary.protectedRecords],
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Field label="Search by name or email">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className={inputClass}
            placeholder="Search internal records"
          />
        </Field>
        <FilterSelect label="Role" value={role} options={['All', ...availableRoles]} onChange={onRoleChange} />
        <FilterSelect label="Status" value={status} options={['All', ...availableStatuses]} onChange={onStatusChange} />
      </div>

      {users.length === 0 ? (
        <EmptyState title="No moderator results" text="Try another filter or reset the demo data." />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-[1120px] divide-y divide-slate-200 text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                {[
                  'User',
                  'Role / status',
                  'Location',
                  'Skills',
                  'Dates',
                  'Password record',
                  'Note',
                  'Actions',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {users.map((user) => {
                const risk = getRiskBadge(user)
                const hashVisible = Boolean(visibleHashes[user.id])

                return (
                  <tr key={user.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950 dark:text-white">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">{shortId(user.id)}</p>
                      <Badge tone={risk.tone} className="mt-2">
                        {risk.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(event) => onUpdateUser(user.id, 'role', event.target.value)}
                        className={inputClass}
                      >
                        {availableRoles.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <select
                        value={user.status}
                        onChange={(event) => onUpdateUser(user.id, 'status', event.target.value)}
                        className={inputClass}
                      >
                        {availableStatuses.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.location}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.skills.map((skill) => (
                          <Badge key={skill} tone="neutral">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <p>Created: {formatDate(user.createdAt)}</p>
                      <p className="mt-1">Last login: {formatDate(user.lastLogin)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {user.hashAlgorithm}
                      </p>
                      <p className="mt-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                        Salt: {maskHash(user.salt)}
                      </p>
                      <p className="mt-1 max-w-xs break-all font-mono text-xs text-slate-600 dark:text-slate-300">
                        Hash: {hashVisible ? user.passwordHash : maskHash(user.passwordHash)}
                      </p>
                      {user.hashFallback && (
                        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                          Demo fallback record.
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {user.internalNote}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleHash(user.id)}
                          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          {hashVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                          {hashVisible ? 'Hide hash' : 'Show hash'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onCopyHash(user)}
                          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Copy size={15} />
                          {copiedId === user.id ? 'Copied' : 'Copy hash'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteUser(user.id)}
                          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SecureUsersRolesDemo
