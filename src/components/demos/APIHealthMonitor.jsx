import { motion } from 'framer-motion'
import { Activity, RefreshCcw, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DemoNotice from '../ui/DemoNotice'

const historyKey = 'alex-portfolio-api-health-history'

const statusStyles = {
  online: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
  degraded: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
  offline: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200',
}

function loadHistory() {
  try {
    return JSON.parse(window.localStorage.getItem(historyKey) || '[]')
  } catch {
    return []
  }
}

function formatDate(value) {
  if (!value) return 'Not checked yet'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  )
}

function APIHealthMonitor() {
  const [health, setHealth] = useState(null)
  const [history, setHistory] = useState(() => loadHistory())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function runHealthCheck() {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/health')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Health check is not available right now.')
      }

      setHealth(data)
      const status = data.summary?.offline > 0 ? 'degraded' : 'online'
      const nextHistory = [
        {
          checkedAt: data.checkedAt,
          status,
          averageResponseTimeMs: data.summary?.averageResponseTimeMs || 0,
        },
        ...history,
      ].slice(0, 5)

      setHistory(nextHistory)
      window.localStorage.setItem(historyKey, JSON.stringify(nextHistory))
    } catch (requestError) {
      setError(requestError.message || 'Health check is not available right now.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runHealthCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const overallStatus = useMemo(() => {
    if (!health) return 'waiting'
    if (health.summary.offline > 0) return 'degraded'
    return 'online'
  }, [health])

  const chartData = (health?.services || []).map((service) => ({
    name: service.name.replace(' ', '\n'),
    responseTimeMs: service.responseTimeMs,
  }))

  return (
    <motion.section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">Backend demo</p>
        <h3 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">API Health Monitor</h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          A small monitoring dashboard that checks backend readiness without exposing private records.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:p-8">
        <DemoNotice>
          This monitor checks backend readiness without exposing private records.
        </DemoNotice>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {overallStatus === 'online' ? 'Backend is responding correctly.' : 'Run a check to inspect backend readiness.'}
          </p>
          <button
            type="button"
            onClick={runHealthCheck}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
          >
            <RefreshCcw size={16} />
            {isLoading ? 'Checking...' : 'Run health check'}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Services online" value={health ? `${health.summary.online}/${health.summary.totalServices}` : '0/0'} />
          <SummaryCard label="Average response" value={health ? `${health.summary.averageResponseTimeMs} ms` : '0 ms'} />
          <SummaryCard label="Last check" value={health ? formatDate(health.checkedAt) : 'Not checked'} />
          <SummaryCard label="Overall status" value={overallStatus} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-bold text-slate-950 dark:text-white">Services</h4>
            <div className="mt-4 grid gap-3">
              {(health?.services || []).map((service) => (
                <div key={service.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{service.name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
                    </div>
                    <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[service.status] || statusStyles.degraded}`}>
                      {service.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {service.responseTimeMs} ms · {formatDate(service.lastChecked)}
                  </p>
                </div>
              ))}
              {!health && !isLoading && (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  Health check results will appear here.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-bold text-slate-950 dark:text-white">Response time</h4>
            <div className="mt-4 h-72">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  Run a health check to see response times.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="responseTimeMs" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-bold text-slate-950 dark:text-white">Local check history</h4>
            <button
              type="button"
              onClick={() => {
                setHistory([])
                window.localStorage.removeItem(historyKey)
              }}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Trash2 size={14} />
              Clear local history
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {history.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">No checks stored yet.</p>
            ) : (
              history.map((item) => (
                <div key={`${item.checkedAt}-${item.averageResponseTimeMs}`} className="flex flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between dark:bg-slate-950">
                  <span className="text-slate-700 dark:text-slate-200">{formatDate(item.checkedAt)}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.status} · {item.averageResponseTimeMs} ms avg</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default APIHealthMonitor
