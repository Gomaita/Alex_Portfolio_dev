import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchMarketPrices } from '../services/marketApi'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const skillBadges = ['API REST', 'async/await', 'error handling', 'Recharts']
const chartFactors = [0.985, 1.01, 0.996, 1.018, 1.006, 1.024]

function buildChartData(markets) {
  return chartFactors.map((factor, index) => {
    const point = { label: `${index * 4}h` }

    markets.forEach((market) => {
      point[market.name] = Number((market.price * factor).toFixed(2))
    })

    return point
  })
}

function MarketDashboard() {
  const [markets, setMarkets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const loadMarketData = useCallback(async (signal) => {
    setIsLoading(true)
    setError('')

    try {
      const prices = await fetchMarketPrices({ signal })
      setMarkets(prices)
      setUpdatedAt(new Date())
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.message)
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadMarketData(controller.signal)

    return () => controller.abort()
  }, [loadMarketData])

  const chartData = useMemo(() => buildChartData(markets), [markets])
  const hasMarketData = markets.length > 0

  return (
    <motion.section
      id="market-dashboard"
      aria-labelledby="market-dashboard-title"
      aria-busy={isLoading}
      className="mb-16 overflow-hidden rounded-md border border-cyan-300/15 bg-slate-950/70 shadow-2xl shadow-slate-950/40"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Featured Technical Demo
            </p>
            <h3
              id="market-dashboard-title"
              className="mt-3 text-3xl font-bold tracking-normal text-white sm:text-4xl"
            >
              Market API Dashboard
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              A live crypto market interface that demonstrates external API
              consumption, async state management, loading skeletons, resilient
              error handling and chart rendering from fetched data.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {skillBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-md border border-white/10 bg-white/[0.04] p-4 sm:w-auto sm:min-w-64">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Data status
            </p>
            <p className="text-sm text-slate-300">
              {updatedAt
                ? `Last updated at ${timeFormatter.format(updatedAt)}`
                : 'Waiting for first market update'}
            </p>
            <button
              type="button"
              aria-label="Refresh cryptocurrency market data"
              onClick={() => loadMarketData()}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        {error && (
          <div
            className="mb-6 rounded-md border border-red-400/25 bg-red-500/10 p-5"
            role="alert"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-red-100">
                  Market data could not be loaded
                </p>
                <p className="mt-2 text-sm leading-6 text-red-100/80">
                  {error}
                </p>
              </div>
              <button
                type="button"
                aria-label="Retry loading cryptocurrency market data"
                onClick={() => loadMarketData()}
                disabled={isLoading}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-200/30 px-4 py-2 text-sm font-semibold text-red-50 transition hover:bg-red-200/10 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3" aria-live="polite">
          {isLoading
            ? ['Bitcoin', 'Ethereum', 'Solana'].map((name) => (
              <div
                key={name}
                aria-label={`Loading ${name} market data`}
                className="min-h-44 overflow-hidden rounded-md border border-white/10 bg-slate-900/70 p-5"
              >
                <div className="animate-pulse">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="h-5 w-24 rounded bg-white/10" />
                      <div className="mt-3 h-4 w-12 rounded bg-white/10" />
                    </div>
                    <div className="h-7 w-12 rounded bg-cyan-300/10" />
                  </div>
                  <div className="mt-8 h-9 w-36 rounded bg-white/10" />
                  <div className="mt-5 h-4 w-24 rounded bg-white/10" />
                </div>
              </div>
            ))
            : markets.map((market, index) => {
              const isPositive = market.change24h >= 0

              return (
                <motion.article
                  key={market.id}
                  aria-label={`${market.name} price ${currencyFormatter.format(
                    market.price,
                  )}, 24 hour change ${percentFormatter.format(
                    market.change24h,
                  )} percent`}
                  className="rounded-md border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-300/40 hover:bg-slate-900/80"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {market.name}
                      </h4>
                      <p className="text-sm font-medium text-slate-400">
                        {market.symbol}
                      </p>
                    </div>
                    <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                      EUR
                    </span>
                  </div>
                  <p className="mt-6 text-3xl font-bold tracking-normal text-white">
                    {currencyFormatter.format(market.price)}
                  </p>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      isPositive ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {percentFormatter.format(market.change24h)}% 24h
                  </p>
                </motion.article>
              )
            })}
        </div>

        <div className="mt-6 rounded-md border border-white/10 bg-slate-950/60 p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">
                Simulated 24h trend
              </h4>
              <p className="text-sm leading-6 text-slate-400">
                Chart values are generated from the latest API prices to keep
                the demo API-key free.
              </p>
            </div>
            <span className="w-fit rounded-md border border-violet-300/25 bg-violet-300/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              Responsive chart
            </span>
          </div>

          <div className="h-72 min-h-72 sm:h-80" aria-live="polite">
            {isLoading && !hasMarketData ? (
              <div
                className="flex h-full animate-pulse items-end gap-2 rounded-md border border-white/10 bg-slate-900/50 p-4 sm:gap-3"
                aria-label="Loading simulated market trend chart"
              >
                {[42, 68, 54, 78, 62, 88, 74].map((height) => (
                  <div
                    key={height}
                    className="flex-1 rounded-t bg-cyan-300/10"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ) : !hasMarketData ? (
              <div className="flex h-full items-center justify-center rounded-md border border-white/10 bg-slate-900/50 p-6 text-center text-sm leading-6 text-slate-400">
                Market trend chart will appear after the first successful API
                response.
              </div>
            ) : (
              <div
                className="h-full"
                role="img"
                aria-label="Simulated 24 hour price trend chart for Bitcoin, Ethereum and Solana"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      tickLine={false}
                      tickFormatter={(value) => `EUR ${value}`}
                      width={78}
                    />
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(value)}
                      contentStyle={{
                        background: '#020617',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '6px',
                        color: '#e2e8f0',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Bitcoin"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Ethereum"
                      stroke="#60a5fa"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Solana"
                      stroke="#a78bfa"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default MarketDashboard
