import { Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sqlQueries } from '../../data/sqlPlaygroundData'
import DemoNotice from '../ui/DemoNotice'

function ResultTable({ rows }) {
  const columns = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows])

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        This query does not return any rows.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left font-semibold capitalize text-slate-700 dark:text-slate-200"
              >
                {column.replaceAll('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
          {rows.map((row, index) => (
            <tr key={`${row.id || row.title || row.name}-${index}`}>
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SQLQueryPlayground() {
  const [activeQueryId, setActiveQueryId] = useState(sqlQueries[0].id)
  const [copied, setCopied] = useState(false)
  const activeQuery = sqlQueries.find((query) => query.id === activeQueryId) || sqlQueries[0]

  async function copySql() {
    if (!navigator.clipboard) return

    try {
      await navigator.clipboard.writeText(activeQuery.sql)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-800/60">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
          Database demo
        </p>
        <h3 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          SQL Query Playground
        </h3>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          A small interface for practicing how SQL queries shape structured
          data. It uses static tables and prepared results, so it works without
          a backend.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <DemoNotice className="lg:col-span-2">
          Static SQL learning demo. Queries are simulated with predefined data.
          No real database is modified from this demo.
        </DemoNotice>

        <div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Choose a query
            </span>
            <select
              value={activeQueryId}
              onChange={(event) => setActiveQueryId(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-950"
            >
              {sqlQueries.map((query) => (
                <option key={query.id} value={query.id}>
                  {query.title}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-950/40">
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">
              {activeQuery.concept}
            </p>
            <p className="mt-2 text-sm leading-6 text-teal-700 dark:text-teal-100">
              {activeQuery.explanation}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-200">SQL</p>
              <button
                type="button"
                onClick={copySql}
                className="inline-flex min-h-8 items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Copy size={13} />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-sky-100">
              <code>{activeQuery.sql}</code>
            </pre>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-lg font-bold text-slate-950 dark:text-white">
            Result
          </h4>
          <ResultTable rows={activeQuery.result} />
        </div>
      </div>
    </section>
  )
}

export default SQLQueryPlayground
