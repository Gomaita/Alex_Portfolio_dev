import { cryptoCacheTtls, defaultVsCurrency } from '../config/cryptoConfig'
import {
  buildHistoryCacheKey,
  buildMarketsCacheKey,
  clearCryptoCache,
  getCachedCryptoData,
  setCachedCryptoData,
} from './cryptoCache'

const staleCacheWarning = 'Using cached data because the API is unavailable.'

export function normalizeMarketData(coins) {
  return (Array.isArray(coins) ? coins : [])
    .map((coin) => ({
      id: coin.id,
      symbol: String(coin.symbol || '').toUpperCase(),
      name: coin.name,
      image: coin.image || '',
      price: Number(coin.current_price ?? coin.price),
      marketCap: coin.market_cap ?? coin.marketCap ?? null,
      volume: coin.total_volume ?? coin.volume ?? null,
      change24h: Number(coin.price_change_percentage_24h ?? coin.change24h ?? 0),
      lastUpdated: coin.last_updated || coin.lastUpdated || new Date().toISOString(),
    }))
    .filter((coin) => coin.id && coin.name && Number.isFinite(coin.price))
}

export function normalizeHistoryData(prices) {
  return (Array.isArray(prices) ? prices : [])
    .map((point) => {
      const timestamp = Number(point.timestamp)
      return {
        timestamp,
        date: point.date || (Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : ''),
        price: Number(point.price),
      }
    })
    .filter((point) => Number.isFinite(point.timestamp) && Number.isFinite(point.price))
}

async function readJsonResponse(response, fallbackMessage) {
  try {
    return await response.json()
  } catch {
    throw new Error(fallbackMessage)
  }
}

async function readErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json()
    return data?.message || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

function cacheResult(entry, { stale = false, warning = '' } = {}) {
  const cachedData = Array.isArray(entry.data?.data) ? entry.data.data : entry.data

  return {
    data: cachedData,
    fromCache: true,
    stale,
    warning,
    fetchedAt: entry.data.fetchedAt || new Date(entry.savedAt).toISOString(),
  }
}

export async function fetchCryptoMarkets({ forceRefresh = false, signal } = {}) {
  const cacheKey = buildMarketsCacheKey(defaultVsCurrency)
  const freshCache = getCachedCryptoData(cacheKey)

  if (!forceRefresh && freshCache) {
    return cacheResult(freshCache)
  }

  try {
    const response = await fetch('/api/crypto/markets', { signal })

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Market data is not available right now.'))
    }

    const payload = await readJsonResponse(response, 'Market API returned an invalid response.')
    const markets = normalizeMarketData(payload.coins)

    if (markets.length === 0) {
      throw new Error('Market data is not available right now.')
    }

    const data = {
      data: markets,
      fetchedAt: payload.fetchedAt || new Date().toISOString(),
    }

    setCachedCryptoData(cacheKey, data, cryptoCacheTtls.markets)

    return {
      data: markets,
      fromCache: false,
      stale: false,
      warning: '',
      fetchedAt: data.fetchedAt,
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error

    const staleCache = getCachedCryptoData(cacheKey, { allowStale: true })
    if (staleCache) return cacheResult(staleCache, { stale: true, warning: staleCacheWarning })

    throw new Error(error.message || 'Market data is not available right now.')
  }
}

export async function fetchCryptoHistory(coinId, range, { forceRefresh = false, signal } = {}) {
  if (range === 'live') {
    return {
      data: [],
      fromCache: false,
      stale: false,
      warning: '',
      fetchedAt: null,
      message: 'Live session chart updates while this page is open.',
    }
  }

  const cacheKey = buildHistoryCacheKey(coinId, range, defaultVsCurrency)
  const freshCache = getCachedCryptoData(cacheKey)

  if (!forceRefresh && freshCache) {
    return cacheResult(freshCache)
  }

  try {
    const response = await fetch(
      `/api/crypto/history?coinId=${encodeURIComponent(coinId)}&range=${encodeURIComponent(range)}`,
      { signal },
    )

    if (!response.ok) {
      throw new Error(
        await readErrorMessage(response, 'Historical data is not available for this coin/range right now.'),
      )
    }

    const payload = await readJsonResponse(
      response,
      'Historical data is not available for this coin/range right now.',
    )
    const prices = normalizeHistoryData(payload.prices)

    if (prices.length === 0) {
      throw new Error('Historical data is not available for this coin/range right now.')
    }

    const data = {
      data: prices,
      fetchedAt: payload.fetchedAt || new Date().toISOString(),
    }

    setCachedCryptoData(cacheKey, data, cryptoCacheTtls[range])

    return {
      data: prices,
      fromCache: false,
      stale: false,
      warning: '',
      fetchedAt: data.fetchedAt,
      message: payload.message || '',
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error

    const staleCache = getCachedCryptoData(cacheKey, { allowStale: true })
    if (staleCache) return cacheResult(staleCache, { stale: true, warning: staleCacheWarning })

    throw new Error(error.message || 'Historical data is not available for this coin/range right now.')
  }
}

export { clearCryptoCache }

export const fetchMarketPrices = fetchCryptoMarkets
