import { motion } from 'framer-motion'
import { Database, RefreshCcw } from 'lucide-react'
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

function formatDate(value) {
  if (!value) return 'No records yet'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  )
}

function D1DatabaseMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [databaseStatus, setDatabaseStatus] = useState('waiting')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMetrics() {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/metrics')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Database metrics are not available right now.')
      }

      setMetrics(data.metrics)
      setUpdatedAt(data.updatedAt)
      setDatabaseStatus(data.databaseStatus || 'online')
    } catch (requestError) {
      setError(requestError.message || 'Database metrics are not available right now.')
      setDatabaseStatus('offline')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  const contactChart = useMemo(() => {
    if (!metrics) return []
    return [
      { name: 'New', value: metrics.newContactMessages },
      { name: 'Reviewed', value: metrics.reviewedContactMessages },
      { name: 'Archived', value: metrics.archivedContactMessages },
    ]
  }, [metrics])

  const projectChart = useMemo(() => {
    if (!metrics) return []
    return [
      { name: 'Pending', value: metrics.pendingProjectSubmissions },
      { name: 'Approved', value: metrics.approvedProjectSubmissions },
      { name: 'Rejected', value: metrics.rejectedProjectSubmissions },
    ]
  }, [metrics])

  const details = useMemo(() => {
    if (!metrics) return []
    return [
      ['Total contact messages', metrics.totalContactMessages, 'All non-deleted contact messages.'],
      ['New contact messages', metrics.newContactMessages, 'Messages still waiting for review.'],
      ['Reviewed contact messages', metrics.reviewedContactMessages, 'Messages marked as reviewed.'],
      ['Archived contact messages', metrics.archivedContactMessages, 'Archived or soft-deleted contact messages.'],
      ['Total project submissions', metrics.totalProjectSubmissions, 'All non-deleted project submissions.'],
      ['Pending project submissions', metrics.pendingProjectSubmissions, 'Submissions waiting for manual moderation.'],
      ['Approved project submissions', metrics.approvedProjectSubmissions, 'Submissions approved by admin.'],
      ['Rejected project submissions', metrics.rejectedProjectSubmissions, 'Submissions rejected by admin.'],
      ['Public projects', metrics.publicProjects, 'Approved submissions visible publicly.'],
      ['Private projects', metrics.privateProjects, 'Submissions hidden from public views.'],
      ['Last contact created', formatDate(metrics.lastContactCreatedAt), 'Most recent contact message timestamp.'],
      ['Last project submission', formatDate(metrics.lastProjectSubmissionCreatedAt), 'Most recent project submission timestamp.'],
    ]
  }, [metrics])

  const allZero =
    metrics &&
    metrics.totalContactMessages === 0 &&
    metrics.totalProjectSubmissions === 0

  return (
    <motion.section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">Database dashboard</p>
        <h3 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">D1 Database Metrics</h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          A privacy-safe dashboard that reads aggregated metrics from Cloudflare D1.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:p-8">
        <DemoNotice>
          Only aggregated counts are shown. Private messages and emails are never exposed.
        </DemoNotice>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Last updated: {formatDate(updatedAt)} · Database status: {databaseStatus}
          </p>
          <button
            type="button"
            onClick={loadMetrics}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
          >
            <RefreshCcw size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        {isLoading && !metrics ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
            ))}
          </div>
        ) : metrics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Contact messages" value={metrics.totalContactMessages} />
              <SummaryCard label="Project submissions" value={metrics.totalProjectSubmissions} />
              <SummaryCard label="Pending reviews" value={metrics.pendingProjectSubmissions} />
              <SummaryCard label="Public projects" value={metrics.publicProjects} />
            </div>

            {allZero && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                The database is connected, but there are no contact messages or project submissions yet.
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h4 className="font-bold text-slate-950 dark:text-white">Contact messages by status</h4>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contactChart}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                      <YAxis stroke="#64748b" tickLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h4 className="font-bold text-slate-950 dark:text-white">Project submissions by moderation status</h4>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectChart}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                      <YAxis stroke="#64748b" tickLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h4 className="font-bold text-slate-950 dark:text-white">Metric details</h4>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {details.map(([name, value, explanation]) => (
                  <div key={name} className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[1fr_0.5fr_1.5fr]">
                    <p className="font-semibold text-slate-950 dark:text-white">{name}</p>
                    <p className="text-slate-700 dark:text-slate-200">{value}</p>
                    <p className="text-slate-500 dark:text-slate-400">{explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <div>
              <Database className="mx-auto text-blue-600 dark:text-sky-300" size={28} />
              <p className="mt-3">Metrics will appear after the first successful request.</p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default D1DatabaseMetrics
