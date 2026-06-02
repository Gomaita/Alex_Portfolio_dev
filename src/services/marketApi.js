const MARKET_API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=eur&include_24hr_change=true'

const cryptoMeta = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
  },
}

export async function fetchMarketPrices({ signal } = {}) {
  const response = await fetch(MARKET_API_URL, { signal })

  if (!response.ok) {
    throw new Error('Unable to load market data. Please try again later.')
  }

  const data = await response.json()

  return Object.values(cryptoMeta).map((crypto) => ({
    ...crypto,
    price: data[crypto.id]?.eur ?? 0,
    change24h: data[crypto.id]?.eur_24h_change ?? 0,
  }))
}
