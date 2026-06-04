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
]

export async function onRequestGet() {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${allowedCoinIds.join(
      ',',
    )}&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'alexgl.dev portfolio demo',
      },
    },
  )

  if (!response.ok) {
    return errorResponse('Crypto market data is not available right now.', 502)
  }

  const data = await response.json()
  const coins = Array.isArray(data)
    ? data.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image || '',
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        last_updated: coin.last_updated,
      }))
    : []

  return jsonResponse({ ok: true, coins })
}
