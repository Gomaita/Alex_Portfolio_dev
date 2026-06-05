import { motion } from 'framer-motion'
import { RefreshCcw, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { liveRefreshMs } from '../config/cryptoConfig'
import { clearCryptoCache, fetchCryptoHistory, fetchCryptoMarkets } from '../services/marketApi'
import DemoNotice from './ui/DemoNotice'

const ranges = [
  { id: 'live', label: 'Live' },
  { id: 'day', label: 'Day' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

const quickCoins = ['bitcoin', 'ethereum', 'solana', 'ripple']
const skillBadges = ['CoinGecko API', 'Recharts', 'Range selector', 'Session cache', 'Live session']

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

function formatCurrency(value) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 'Not available'

  let maximumFractionDigits = 2
  if (Math.abs(numericValue) < 0.01) {
    maximumFractionDigits = 8
  } else if (Math.abs(numericValue) < 1) {
    maximumFractionDigits = 6
  } else if (Math.abs(numericValue) < 1000) {
    maximumFractionDigits = 4
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: numericValue >= 1000 ? 2 : 0,
    maximumFractionDigits,
  }).format(numericValue)
}

function formatCompactCurrency(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? compactCurrencyFormatter.format(numericValue) : 'Not available'
}

function getPriceDomain(data) {
  const prices = data.map((point) => Number(point.price)).filter(Number.isFinite)
  if (prices.length === 0) return ['auto', 'auto']

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const padding = min === max ? Math.abs(min) * 0.01 || 1 : (max - min) * 0.1

  return [Math.max(0, min - padding), max + padding]
}

function formatDateLabel(timestamp, range) {
  const date = new Date(timestamp)
  if (range === 'day' || range === 'live') {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date)
  }
  if (range === 'month') {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date)
}

function formatStatusTime(value) {
  if (!value) return 'Not updated yet'
  return `Last updated ${formatDateLabel(new Date(value).getTime(), 'live')}`
}

function cacheStatusLabel({ fromCache, stale }) {
  if (stale) return 'Using stale cache'
  if (fromCache) return 'From session cache'
  return 'Fresh data'
}

function MarketCard({ coin, active, onSelect }) {
  const isPositive = coin.change24h >= 0

  return (
    <button
      type="button"
      onClick={() => onSelect(coin.id)}
      className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950 ${
        active
          ? 'border-blue-300 bg-blue-50 shadow-sm dark:border-sky-700 dark:bg-sky-950/40'
          : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-950 dark:text-white">{coin.name}</h4>
          <p className="mt-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{coin.symbol}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isPositive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200'}`}>
          {isPositive ? '+' : ''}{percentFormatter.format(coin.change24h)}%
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
        {formatCurrency(coin.price)}
      </p>
      <div className="mt-4 grid gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>Market cap: {formatCompactCurrency(coin.marketCap)}</p>
        <p>Volume: {formatCompactCurrency(coin.volume)}</p>
      </div>
    </button>
  )
}

function MarketDashboard() {
  const [coins, setCoins] = useState([])
  const [selectedCoinId, setSelectedCoinId] = useState('bitcoin')
  const [range, setRange] = useState('live')
  const [searchQuery, setSearchQuery] = useState('')
  const [history, setHistory] = useState([])
  const [liveSessionByCoin, setLiveSessionByCoin] = useState({})
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState('')
  const [historyError, setHistoryError] = useState('')
  const [cacheMessage, setCacheMessage] = useState('')
  const [lastMarketRefresh, setLastMarketRefresh] = useState(null)
  const [lastChartRefresh, setLastChartRefresh] = useState(null)
  const [marketDataFromCache, setMarketDataFromCache] = useState(false)
  const [marketDataStale, setMarketDataStale] = useState(false)
  const [chartDataFromCache, setChartDataFromCache] = useState(false)
  const [chartDataStale, setChartDataStale] = useState(false)
  const [nextLiveRefreshSeconds, setNextLiveRefreshSeconds] = useState(liveRefreshMs / 1000)

  const selectedCoin = coins.find((coin) => coin.id === selectedCoinId) || coins[0]

  const loadMarkets = useCallback(async ({ forceRefresh = false, signal } = {}) => {
    setIsLoadingMarkets(true)
    setError('')

    try {
      const result = await fetchCryptoMarkets({ forceRefresh, signal })
      setCoins(result.data)
      setLastMarketRefresh(result.fetchedAt || new Date().toISOString())
      setMarketDataFromCache(result.fromCache)
      setMarketDataStale(result.stale)
      setCacheMessage(result.warning || (result.fromCache ? 'Data from cache.' : 'Data refreshed.'))

      setSelectedCoinId((currentCoinId) =>
        result.data.some((coin) => coin.id === currentCoinId) ? currentCoinId : result.data[0]?.id || currentCoinId,
      )
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.message || 'Market data is not available right now.')
      }
    } finally {
      if (!signal?.aborted) setIsLoadingMarkets(false)
    }
  }, [])

  const loadHistory = useCallback(async (coinId, selectedRange, { forceRefresh = false, signal } = {}) => {
    if (!coinId || selectedRange === 'live') return

    setIsLoadingHistory(true)
    setHistoryError('')
    setHistory([])

    try {
      const result = await fetchCryptoHistory(coinId, selectedRange, { forceRefresh, signal })
      setHistory(result.data)
      setLastChartRefresh(result.fetchedAt || new Date().toISOString())
      setChartDataFromCache(result.fromCache)
      setChartDataStale(result.stale)
      setHistoryError(result.warning || '')
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setHistory([])
        setChartDataFromCache(false)
        setChartDataStale(false)
        setHistoryError(requestError.message || 'Historical data is not available for this coin/range right now.')
      }
    } finally {
      if (!signal?.aborted) setIsLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadMarkets({ signal: controller.signal })
    return () => controller.abort()
  }, [loadMarkets])

  useEffect(() => {
    const controller = new AbortController()
    if (range === 'live') {
      setHistory([])
      setHistoryError('')
      setChartDataFromCache(false)
      setChartDataStale(false)
    } else {
      loadHistory(selectedCoinId, range, { signal: controller.signal })
    }
    return () => controller.abort()
  }, [loadHistory, range, selectedCoinId])

  useEffect(() => {
    if (range !== 'live' || !selectedCoin) return

    setLiveSessionByCoin((current) => {
      const currentCoinPoints = current[selectedCoin.id] || []
      const latestPoint = currentCoinPoints[currentCoinPoints.length - 1]
      if (latestPoint?.price === selectedCoin.price && latestPoint?.marketRefresh === lastMarketRefresh) {
        return current
      }

      return {
        ...current,
        [selectedCoin.id]: [
          ...currentCoinPoints.slice(-29),
          {
            coinId: selectedCoin.id,
            marketRefresh: lastMarketRefresh,
            timestamp: Date.now(),
            price: selectedCoin.price,
          },
        ],
      }
    })
  }, [range, selectedCoin?.id, selectedCoin?.price, lastMarketRefresh])

  useEffect(() => {
    if (range !== 'live') return undefined

    setNextLiveRefreshSeconds(liveRefreshMs / 1000)
    const countdownId = window.setInterval(() => {
      setNextLiveRefreshSeconds((current) => (current <= 1 ? liveRefreshMs / 1000 : current - 1))
    }, 1000)

    const refreshId = window.setInterval(() => {
      loadMarkets()
    }, liveRefreshMs)

    return () => {
      window.clearInterval(countdownId)
      window.clearInterval(refreshId)
    }
  }, [loadMarkets, range])

  const filteredCoins = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return coins
    return coins.filter((coin) =>
      `${coin.name} ${coin.symbol}`.toLowerCase().includes(normalized),
    )
  }, [coins, searchQuery])

  const chartData = useMemo(() => {
    const source = range === 'live'
      ? liveSessionByCoin[selectedCoinId] || []
      : history

    return source.map((point) => ({
      label: formatDateLabel(point.timestamp, range),
      timestamp: point.timestamp,
      price: point.price,
    }))
  }, [history, liveSessionByCoin, range, selectedCoinId])

  const priceDomain = useMemo(() => getPriceDomain(chartData), [chartData])

  const topMovers = useMemo(() => {
    const sorted = [...coins].sort((a, b) => b.change24h - a.change24h)
    return {
      gainer: sorted[0],
      loser: sorted[sorted.length - 1],
    }
  }, [coins])

  function refreshData() {
    if (range === 'live') {
      loadMarkets({ forceRefresh: true })
      return
    }

    loadHistory(selectedCoinId, range, { forceRefresh: true })
  }

  function handleClearCache() {
    clearCryptoCache()
    setCacheMessage('Crypto cache cleared.')
    setHistory([])
    setLiveSessionByCoin({})
    if (range === 'live') {
      loadMarkets({ forceRefresh: true })
    } else {
      loadHistory(selectedCoinId, range, { forceRefresh: true })
    }
  }

  function handleSelectCoin(coinId) {
    setSelectedCoinId(coinId)
    setHistoryError('')
    setHistory([])
    setLiveSessionByCoin((current) => ({
      ...current,
      [coinId]: [],
    }))
  }

  function handleRangeChange(nextRange) {
    setRange(nextRange)
    setHistoryError('')
    setHistory([])
    setChartDataFromCache(false)
    setChartDataStale(false)
  }

  return (
    <motion.section
      id="market-dashboard"
      aria-labelledby="market-dashboard-title"
      aria-busy={isLoadingMarkets || isLoadingHistory}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
              Featured Technical Demo
            </p>
            <h3 id="market-dashboard-title" className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              Market API Dashboard
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              Crypto market dashboard with multiple assets, adaptive chart scaling, session cache and clearer public API error handling.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {skillBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:w-auto sm:min-w-72 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Data status</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{formatStatusTime(lastMarketRefresh)}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Markets: {cacheStatusLabel({ fromCache: marketDataFromCache, stale: marketDataStale })}
            </p>
            {range === 'live' && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Next refresh in {nextLiveRefreshSeconds}s
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={refreshData}
                disabled={isLoadingMarkets || isLoadingHistory}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
              >
                <RefreshCcw size={16} />
                {isLoadingMarkets || isLoadingHistory ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={handleClearCache}
                disabled={isLoadingMarkets || isLoadingHistory}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 size={16} />
                Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        <DemoNotice className="mb-6">
          Market data from CoinGecko public API. Live uses one shared market refresh per minute. Historical ranges are cached during the session to avoid rate limits.
        </DemoNotice>

        {cacheMessage && (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200">
            {cacheMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search coins</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Filter by coin or symbol"
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {quickCoins.map((coinId) => {
              const coin = coins.find((item) => item.id === coinId)
              return (
                <button
                  key={coinId}
                  type="button"
                  onClick={() => handleSelectCoin(coinId)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {coin?.symbol || coinId}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoadingMarkets && coins.length === 0 ? (
            Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
            ))
          ) : filteredCoins.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 sm:col-span-2 xl:col-span-4 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              No coins match the current filter.
            </div>
          ) : (
            filteredCoins.map((coin) => (
              <MarketCard
                key={coin.id}
                coin={coin}
                active={coin.id === selectedCoinId}
                onSelect={handleSelectCoin}
              />
            ))
          )}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Selected coin</p>
            {selectedCoin ? (
              <>
                <h4 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{selectedCoin.name}</h4>
                <p className="mt-1 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{selectedCoin.symbol}</p>
                <p className="mt-5 text-3xl font-bold text-slate-950 dark:text-white">{formatCurrency(selectedCoin.price)}</p>
                <p className={`mt-2 text-sm font-semibold ${selectedCoin.change24h >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                  {selectedCoin.change24h >= 0 ? '+' : ''}{percentFormatter.format(selectedCoin.change24h)}% in 24h
                </p>
                <div className="mt-5 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>Top gainer: {topMovers.gainer?.name || 'Not available'}</p>
                  <p>Top loser: {topMovers.loser?.name || 'Not available'}</p>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Select a coin to see details.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
                  {selectedCoin?.name || 'Coin'} chart - {ranges.find((item) => item.id === range)?.label}
                </h4>
                {selectedCoin && (
                  <p className={`mt-1 text-sm font-semibold ${selectedCoin.change24h >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                    {formatCurrency(selectedCoin.price)} - {selectedCoin.change24h >= 0 ? '+' : ''}{percentFormatter.format(selectedCoin.change24h)}% 24h
                  </p>
                )}
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {range === 'live'
                    ? 'Live chart shows session data collected while this page is open.'
                    : 'Historical chart uses CoinGecko market_chart data loaded on demand.'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Chart: {range === 'live' ? 'Session data' : cacheStatusLabel({ fromCache: chartDataFromCache, stale: chartDataStale })} - {formatStatusTime(range === 'live' ? lastMarketRefresh : lastChartRefresh)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ranges.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRangeChange(item.id)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      range === item.id
                        ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {historyError && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200" role="alert">
                <p>{historyError}</p>
                {range !== 'live' && (
                  <button
                    type="button"
                    onClick={() => loadHistory(selectedCoinId, range, { forceRefresh: true })}
                    className="mt-3 rounded-md bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-100 dark:hover:bg-amber-900"
                  >
                    Retry chart
                  </button>
                )}
              </div>
            )}

            <div className="h-72 min-h-72 sm:h-80">
              {isLoadingHistory ? (
                <div className="flex h-full animate-pulse items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  {[42, 68, 54, 78, 62, 88, 74].map((height) => (
                    <div key={height} className="flex-1 rounded-t bg-blue-100 dark:bg-slate-800" style={{ height: `${height}%` }} />
                  ))}
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  {historyError
                    ? 'Historical data is not available for this coin/range right now.'
                    : range === 'live'
                      ? 'Live session will add more points as data refreshes.'
                      : 'Historical chart will appear after a successful API response.'}
                </div>
              ) : (
                <div className="h-full">
                  {range === 'live' && chartData.length < 2 && (
                    <p className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
                      Live session will add more points as data refreshes.
                    </p>
                  )}
                  <div className={range === 'live' && chartData.length < 2 ? 'h-[calc(100%-44px)]' : 'h-full'}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 12, right: 12, bottom: 0, left: 4 }}>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis dataKey="label" stroke="#64748b" tickLine={false} minTickGap={24} />
                        <YAxis
                          stroke="#64748b"
                          tickLine={false}
                          domain={priceDomain}
                          tickFormatter={formatCurrency}
                          width={92}
                        />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Price']}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={chartData.length < 2}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Data source: CoinGecko public API. Historical ranges are cached during this browser session.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default MarketDashboard
