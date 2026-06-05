export const allowedCoins = [
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

export const defaultVsCurrency = 'eur'

export const liveRefreshMs = 60000

export const cryptoCacheTtls = {
  markets: 60000,
  livePrices: 60000,
  day: 5 * 60 * 1000,
  month: 30 * 60 * 1000,
  year: 12 * 60 * 60 * 1000,
}
