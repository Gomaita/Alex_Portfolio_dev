import { allowedCoinIds } from './markets.js'
import { errorResponse, jsonResponse } from '../../_utils/response.js'
import { sanitizeText } from '../../_utils/sanitize.js'

const rangeToDays = {
  day: 1,
  month: 30,
  year: 365,
}

const allowedRanges = new Set(['live', 'day', 'month', 'year'])

export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const coinId = sanitizeText(url.searchParams.get('coinId') || '', 60)
  const range = sanitizeText(url.searchParams.get('range') || 'day', 20)

  if (!allowedCoinIds.includes(coinId)) {
    return errorResponse('Unsupported coin id.', 400)
  }

  if (!allowedRanges.has(range)) {
    return errorResponse('Unsupported history range.', 400)
  }

  if (range === 'live') {
    return jsonResponse({
      ok: true,
      range,
      prices: [],
      message: 'Live session chart updates while this page is open.',
    })
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        coinId,
      )}/market_chart?vs_currency=eur&days=${rangeToDays[range]}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'alexgl.dev portfolio demo',
        },
      },
    )

    if (!response.ok) {
      try {
        await response.text()
      } catch {
        // Keep external details out of the public response.
      }

      if (response.status === 429) {
        return errorResponse('Market history is rate limited right now. Try again later.', 429)
      }

      if (response.status === 404) {
        return errorResponse('Market history was not found for this coin.', 404)
      }

      return errorResponse('Market history is not available right now.', 502)
    }

    let data
    try {
      data = await response.json()
    } catch {
      return errorResponse('Market history is not available right now.', 502)
    }

    if (!Array.isArray(data.prices)) {
      return errorResponse('Market history is not available right now.', 502)
    }

    const prices = data.prices
      .map(([timestamp, price]) => {
        const normalizedTimestamp = Number(timestamp)
        return {
          timestamp: normalizedTimestamp,
          date: Number.isFinite(normalizedTimestamp) ? new Date(normalizedTimestamp).toISOString() : '',
          price: Number(price),
        }
      })
      .filter((point) => Number.isFinite(point.timestamp) && Number.isFinite(point.price))

    if (prices.length === 0) {
      return errorResponse('Market history is not available right now.', 502)
    }

    return jsonResponse({ ok: true, coinId, range, prices })
  } catch {
    return errorResponse('Market history is not available right now.', 502)
  }
}
