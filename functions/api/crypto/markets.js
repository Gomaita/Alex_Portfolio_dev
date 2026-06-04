import { errorResponse, jsonResponse } from '../../_utils/response.js'

export const allowedCoinIds = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'cardano',
  'dogecoin',
  'polkadot',
  'chainlink',
  'avalanche-2',
  'tron',
  'litecoin',
  'polygon',
  'stellar',
  'uniswap',
]

async function safeErrorResponse(response) {
  let detail = ''
  try {
    detail = await response.text()
  } catch {
    detail = ''
  }

  if (response.status === 429) {
    return errorResponse('Market data is rate limited right now. Try again later.', 429)
  }

  if (response.status === 404) {
    return errorResponse('Market data was not found.', 404)
  }

  return errorResponse(
    detail ? 'Crypto market data is not available right now.' : 'Crypto market data is not available right now.',
    502,
  )
}

export async function onRequestGet() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${allowedCoinIds.join(
        ',',
      )}&order=market_cap_desc&per_page=${allowedCoinIds.length}&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'alexgl.dev portfolio demo',
        },
      },
    )

    if (!response.ok) {
      return safeErrorResponse(response)
    }

    let data
    try {
      data = await response.json()
    } catch {
      return errorResponse('Crypto market data returned an invalid response.', 502)
    }

    const coins = Array.isArray(data)
      ? data
          .filter((coin) => Number.isFinite(Number(coin.current_price)))
          .map((coin) => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image || '',
            current_price: Number(coin.current_price),
            market_cap: coin.market_cap,
            total_volume: coin.total_volume,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            last_updated: coin.last_updated,
          }))
      : []

    return jsonResponse({ ok: true, coins })
  } catch {
    return errorResponse('Crypto market data is not available right now.', 502)
  }
}
