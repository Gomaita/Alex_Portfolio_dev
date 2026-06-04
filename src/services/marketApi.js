const fallbackCoins = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 64000, market_cap: 1260000000000, total_volume: 32000000000, price_change_percentage_24h: 1.8, last_updated: new Date().toISOString() },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3100, market_cap: 374000000000, total_volume: 18000000000, price_change_percentage_24h: -0.7, last_updated: new Date().toISOString() },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 145, market_cap: 67000000000, total_volume: 3900000000, price_change_percentage_24h: 2.4, last_updated: new Date().toISOString() },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.48, market_cap: 27000000000, total_volume: 1200000000, price_change_percentage_24h: 0.6, last_updated: new Date().toISOString() },
]

export function normalizeMarketData(coins) {
  return (Array.isArray(coins) ? coins : []).map((coin) => ({
    id: coin.id,
    symbol: String(coin.symbol || '').toUpperCase(),
    name: coin.name,
    image: coin.image || '',
    price: Number(coin.current_price ?? coin.price ?? 0),
    marketCap: coin.market_cap ?? coin.marketCap ?? null,
    volume: coin.total_volume ?? coin.volume ?? null,
    change24h: Number(coin.price_change_percentage_24h ?? coin.change24h ?? 0),
    lastUpdated: coin.last_updated || coin.lastUpdated || new Date().toISOString(),
    isFallback: Boolean(coin.isFallback),
  }))
}

export function normalizeHistoryData(prices) {
  return (Array.isArray(prices) ? prices : []).map((point) => ({
    timestamp: point.timestamp,
    date: point.date || new Date(point.timestamp).toISOString(),
    price: Number(point.price),
  }))
}

export async function fetchCryptoMarkets({ signal } = {}) {
  try {
    const response = await fetch('/api/crypto/markets', { signal })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || 'Market data is not available right now.')
    }

    return normalizeMarketData(data.coins)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    return normalizeMarketData(fallbackCoins.map((coin) => ({ ...coin, isFallback: true })))
  }
}

export async function fetchCryptoHistory(coinId, range, { signal } = {}) {
  if (range === 'live') {
    return { prices: [], message: 'Live session chart updates while this page is open.' }
  }

  const response = await fetch(
    `/api/crypto/history?coinId=${encodeURIComponent(coinId)}&range=${encodeURIComponent(range)}`,
    { signal },
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Crypto history data is not available right now.')
  }

  return {
    prices: normalizeHistoryData(data.prices),
    message: data.message || '',
  }
}

export const fetchMarketPrices = fetchCryptoMarkets
