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
import DemoNotice from './ui/DemoNotice'

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
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Featured Technical Demo
            </p>
            <h3
              id="market-dashboard-title"
              className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl"
            >
              Market API Dashboard
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              A live crypto market interface that demonstrates external API
              consumption, async state management, loading skeletons, resilient
              error handling and chart rendering from fetched data.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {skillBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:w-auto sm:min-w-64">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Data status
            </p>
            <p className="text-sm text-slate-600">
              {updatedAt
                ? `Last updated at ${timeFormatter.format(updatedAt)}`
                : 'Waiting for first market update'}
            </p>
            <button
              type="button"
              aria-label="Refresh cryptocurrency market data"
              onClick={() => loadMarketData()}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        <DemoNotice className="mb-6">
          API demo. Data may depend on external service availability.
        </DemoNotice>

        {error && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5"
            role="alert"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-red-700">
                  Market data could not be loaded
                </p>
                <p className="mt-2 text-sm leading-6 text-red-600">
                  {error}
                </p>
              </div>
              <button
                type="button"
                aria-label="Retry loading cryptocurrency market data"
                onClick={() => loadMarketData()}
                disabled={isLoading}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
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
                className="min-h-44 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="animate-pulse">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="h-5 w-24 rounded bg-slate-200" />
                      <div className="mt-3 h-4 w-12 rounded bg-slate-200" />
                    </div>
                    <div className="h-7 w-12 rounded bg-blue-100" />
                  </div>
                  <div className="mt-8 h-9 w-36 rounded bg-slate-200" />
                  <div className="mt-5 h-4 w-24 rounded bg-slate-200" />
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
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-950">
                        {market.name}
                      </h4>
                      <p className="text-sm font-medium text-slate-500">
                        {market.symbol}
                      </p>
                    </div>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      EUR
                    </span>
                  </div>
                  <p className="mt-6 text-3xl font-bold tracking-normal text-slate-950">
                    {currencyFormatter.format(market.price)}
                  </p>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {percentFormatter.format(market.change24h)}% 24h
                  </p>
                </motion.article>
              )
            })}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-950">
                Simulated 24h trend
              </h4>
              <p className="text-sm leading-6 text-slate-600">
                Chart values are generated from the latest API prices to keep
                the demo API-key free.
              </p>
            </div>
            <span className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              Mobile-friendly chart
            </span>
          </div>

          <div className="h-72 min-h-72 sm:h-80" aria-live="polite">
            {isLoading && !hasMarketData ? (
              <div
                className="flex h-full animate-pulse items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:gap-3"
                aria-label="Loading simulated market trend chart"
              >
                {[42, 68, 54, 78, 62, 88, 74].map((height) => (
                  <div
                    key={height}
                    className="flex-1 rounded-t bg-blue-100"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ) : !hasMarketData ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm leading-6 text-slate-600">
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
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="label" stroke="#64748b" tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      tickLine={false}
                      tickFormatter={(value) => `EUR ${value}`}
                      width={78}
                    />
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(value)}
                      contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        color: '#0f172a',
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
