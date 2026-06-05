import { defaultVsCurrency } from '../config/cryptoConfig'

const cachePrefix = 'crypto'

function getStorage() {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null
    return window.sessionStorage
  } catch {
    return null
  }
}

export function buildMarketsCacheKey(vsCurrency = defaultVsCurrency) {
  return `${cachePrefix}:markets:${vsCurrency}`
}

export function buildHistoryCacheKey(coinId, range, vsCurrency = defaultVsCurrency) {
  return `${cachePrefix}:history:${coinId}:${range}:${vsCurrency}`
}

export function isCacheFresh(entry) {
  return Boolean(entry?.expiresAt && Date.now() < entry.expiresAt)
}

export function getCachedCryptoData(key, { allowStale = false } = {}) {
  const storage = getStorage()
  if (!storage) return null

  try {
    const raw = storage.getItem(key)
    if (!raw) return null

    const entry = JSON.parse(raw)
    if (!entry || typeof entry !== 'object' || !entry.data) {
      storage.removeItem(key)
      return null
    }

    if (!allowStale && !isCacheFresh(entry)) return null

    return entry
  } catch {
    try {
      storage.removeItem(key)
    } catch {
      // Ignore storage cleanup failures.
    }
    return null
  }
}

export function setCachedCryptoData(key, data, ttlMs) {
  const storage = getStorage()
  if (!storage) return null

  const savedAt = Date.now()
  const entry = {
    savedAt,
    expiresAt: savedAt + ttlMs,
    data,
  }

  try {
    storage.setItem(key, JSON.stringify(entry))
    return entry
  } catch {
    return null
  }
}

export function clearCryptoCache() {
  const storage = getStorage()
  if (!storage) return

  try {
    Object.keys(storage)
      .filter((key) => key.startsWith(`${cachePrefix}:`))
      .forEach((key) => storage.removeItem(key))
  } catch {
    // Ignore storage cleanup failures.
  }
}
