import { motion } from 'framer-motion'
import { Clock, LogOut, RefreshCcw, Shield, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import DemoNotice from '../ui/DemoNotice'

const demoUsers = {
  'admin@example.com': {
    email: 'admin@example.com',
    password: 'demo-admin',
    role: 'admin',
    permissions: ['View dashboard', 'Manage users', 'Access admin panel', 'Review submissions'],
  },
  'user@example.com': {
    email: 'user@example.com',
    password: 'demo-user',
    role: 'user',
    permissions: ['View dashboard', 'Edit profile'],
  },
  'viewer@example.com': {
    email: 'viewer@example.com',
    password: 'demo-viewer',
    role: 'viewer',
    permissions: ['View public area'],
  },
}

const timelineSteps = [
  'Submit credentials',
  'Validate user',
  'Create session',
  'Check permissions',
  'Access protected area',
]

const accessRules = {
  public: ['admin', 'user', 'viewer'],
  user: ['admin', 'user'],
  admin: ['admin'],
}

const storageKey = 'alex-portfolio-auth-flow-session'

function createSession(user) {
  const createdAt = new Date()
  const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000)

  return {
    sessionId: `demo_${crypto.randomUUID?.() || Date.now()}`,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
}

function getRemainingMinutes(session) {
  if (!session) return 0
  return Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 60000))
}

function AuthFlowSimulator() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('demo-admin')
  const [remember, setRemember] = useState(false)
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    } catch {
      return null
    }
  })
  const [activeArea, setActiveArea] = useState('public')
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])

  const isExpired = session ? new Date(session.expiresAt).getTime() <= Date.now() : true
  const canAccess = session && !isExpired && accessRules[activeArea].includes(session.role)

  function addEvent(message) {
    setEvents((current) => [
      { id: `${Date.now()}-${message}`, message, time: new Date().toISOString() },
      ...current,
    ].slice(0, 8))
  }

  function switchDemoUser(userEmail) {
    const user = demoUsers[userEmail]
    setEmail(user.email)
    setPassword(user.password)
    setError('')
  }

  function login(event) {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!password.trim()) {
      setError('Password is required.')
      return
    }

    const user = demoUsers[email.trim().toLowerCase()]

    if (!user || user.password !== password) {
      setError('Credentials do not match a demo user.')
      addEvent('Login failed')
      return
    }

    const nextSession = createSession(user)
    setSession(nextSession)
    addEvent(`Login successful as ${user.role}`)

    if (remember) {
      window.localStorage.setItem(storageKey, JSON.stringify(nextSession))
    } else {
      window.localStorage.removeItem(storageKey)
    }
  }

  function logout() {
    setSession(null)
    window.localStorage.removeItem(storageKey)
    addEvent('Logout')
  }

  function expireSession() {
    if (!session) return
    const expired = { ...session, expiresAt: new Date(Date.now() - 1000).toISOString() }
    setSession(expired)
    window.localStorage.removeItem(storageKey)
    addEvent('Session expired')
  }

  function refreshSession() {
    if (!session) return
    const refreshed = {
      ...session,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }
    setSession(refreshed)
    if (remember) window.localStorage.setItem(storageKey, JSON.stringify(refreshed))
    addEvent('Session refreshed')
  }

  function openArea(area) {
    setActiveArea(area)
    if (session && !isExpired && !accessRules[area].includes(session.role)) {
      addEvent(`Access denied for ${area} area`)
    }
  }

  const visibleStatus = useMemo(() => {
    if (!session) return 'No active session'
    return isExpired ? 'Expired' : 'Active'
  }, [isExpired, session])

  return (
    <motion.section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
          Educational simulator
        </p>
        <h3 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
          Auth Flow Simulator
        </h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          This demo shows login states, session expiration, permissions and protected views without implementing real authentication.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <DemoNotice className="lg:col-span-2">
          This is a frontend learning simulator. Real authentication should be handled on the backend with secure sessions, password hashing and proper access control.
        </DemoNotice>

        <div className="grid gap-5">
          <form onSubmit={login} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-lg font-bold text-slate-950 dark:text-white">Demo login</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Use visible demo credentials. Nothing is sent to a backend.
            </p>

            <div className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
              {Object.values(demoUsers).map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => switchDemoUser(user.email)}
                  className="text-left text-slate-700 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-sky-300"
                >
                  {user.email} / {user.password}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4"
                />
                Remember simulated session in localStorage
              </label>
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </p>
              )}
              <button className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-sky-500 dark:text-slate-950">
                Login to simulator
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-lg font-bold text-slate-950 dark:text-white">Session panel</h4>
            {session ? (
              <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                <p><strong className="text-slate-950 dark:text-white">Current user:</strong> {session.email}</p>
                <p><strong className="text-slate-950 dark:text-white">Role:</strong> {session.role}</p>
                <p><strong className="text-slate-950 dark:text-white">Status:</strong> {visibleStatus}</p>
                <p><strong className="text-slate-950 dark:text-white">Expires in:</strong> {getRemainingMinutes(session)} min</p>
                <p className="break-all"><strong className="text-slate-950 dark:text-white">Session ID:</strong> {session.sessionId}</p>
                <div className="flex flex-wrap gap-2">
                  {session.permissions.map((permission) => (
                    <span key={permission} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
                      {permission}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={logout} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-slate-700">
                    <LogOut size={14} /> Logout
                  </button>
                  <button type="button" onClick={expireSession} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-slate-700">
                    <Clock size={14} /> Expire session
                  </button>
                  <button type="button" onClick={refreshSession} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-slate-700">
                    <RefreshCcw size={14} /> Refresh session
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No active simulated session.</p>
            )}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-lg font-bold text-slate-950 dark:text-white">Protected areas</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {['public', 'user', 'admin'].map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => openArea(area)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${activeArea === area ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950' : 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}
                >
                  {area} area
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              {canAccess ? (
                <>
                  <p className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
                    <Shield size={18} /> Access granted
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    The simulated {session.role} role can open the {activeArea} area.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-red-700 dark:text-red-300">Access denied</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {session ? 'The current role or session state does not allow this area.' : 'Login with a demo account to test protected views.'}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-bold text-slate-950 dark:text-white">Timeline</h4>
              <ol className="mt-4 space-y-3">
                {timelineSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white dark:bg-sky-500 dark:text-slate-950">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-slate-950 dark:text-white">Event log</h4>
                <button type="button" onClick={() => setEvents([])} className="text-xs font-semibold text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
                  Clear
                </button>
              </div>
              <div className="mt-4 grid gap-2">
                {events.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">No events yet.</p>
                ) : (
                  events.map((event) => (
                    <p key={event.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                      {event.message}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default AuthFlowSimulator
