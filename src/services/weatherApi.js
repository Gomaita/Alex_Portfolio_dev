const fallbackCities = [
  { id: 'fallback-alicante', name: 'Alicante', country: 'Spain', admin1: 'Valencian Community', latitude: 38.3452, longitude: -0.481, label: 'Alicante, Valencian Community, Spain' },
  { id: 'fallback-madrid', name: 'Madrid', country: 'Spain', admin1: 'Madrid', latitude: 40.4168, longitude: -3.7038, label: 'Madrid, Madrid, Spain' },
  { id: 'fallback-london', name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5072, longitude: -0.1276, label: 'London, England, United Kingdom' },
  { id: 'fallback-tokyo', name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503, label: 'Tokyo, Tokyo, Japan' },
]

const fallbackWeather = {
  Alicante: { temperature: 24, feelsLike: 25, humidity: 58, windSpeed: 12, weatherCode: 0, description: 'Clear sky', dailyMaxTemperature: null, dailyMinTemperature: null },
  Madrid: { temperature: 19, feelsLike: 18, humidity: 44, windSpeed: 10, weatherCode: 2, description: 'Partly cloudy', dailyMaxTemperature: null, dailyMinTemperature: null },
  London: { temperature: 13, feelsLike: 12, humidity: 76, windSpeed: 16, weatherCode: 61, description: 'Slight rain', dailyMaxTemperature: null, dailyMinTemperature: null },
  Tokyo: { temperature: 21, feelsLike: 22, humidity: 68, windSpeed: 9, weatherCode: 2, description: 'Partly cloudy', dailyMaxTemperature: null, dailyMinTemperature: null },
}

function normalizeQuery(query) {
  return query.trim().toLowerCase()
}

function normalizeCity(city) {
  return {
    id: city.id || `${city.latitude}-${city.longitude}`,
    name: city.name,
    country: city.country || '',
    admin1: city.admin1 || city.state || '',
    latitude: Number(city.latitude ?? city.lat),
    longitude: Number(city.longitude ?? city.lon),
    label:
      city.label ||
      [city.name, city.admin1 || city.state, city.country].filter(Boolean).join(', '),
  }
}

function normalizeWeather(weather, city) {
  return {
    city: weather.city || city?.name || 'Selected city',
    country: weather.country || city?.country || '',
    temperature: weather.temperature ?? 'Not available',
    feelsLike: weather.feelsLike ?? 'Not available',
    humidity: weather.humidity ?? 'Not available',
    windSpeed: weather.windSpeed ?? 'Not available',
    weatherCode: weather.weatherCode ?? 'Not available',
    description: weather.description || 'Weather data available',
    dailyMaxTemperature: weather.dailyMaxTemperature ?? null,
    dailyMinTemperature: weather.dailyMinTemperature ?? null,
    updatedAt: weather.updatedAt || new Date().toISOString(),
    latitude: weather.latitude ?? city?.latitude,
    longitude: weather.longitude ?? city?.longitude,
    source: weather.source || 'Open-Meteo',
    isFallback: Boolean(weather.isFallback),
  }
}

function fallbackSearch(query) {
  const normalized = normalizeQuery(query)
  return fallbackCities.filter((city) => normalizeQuery(city.label).includes(normalized))
}

function getFallbackWeather(city) {
  const base = fallbackWeather[city.name] || fallbackWeather.Alicante

  return normalizeWeather(
    {
      ...base,
      city: city.name,
      country: city.country,
      updatedAt: new Date().toISOString(),
      latitude: city.latitude,
      longitude: city.longitude,
      source: 'Fallback demo data',
      isFallback: true,
    },
    city,
  )
}

export async function searchCities(query) {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length < 2) return []
  if (trimmedQuery.length > 80) {
    throw new Error('City search is too long.')
  }

  try {
    const response = await fetch(`/api/weather/search?q=${encodeURIComponent(trimmedQuery)}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || 'Weather service is not available right now.')
    }

    return Array.isArray(data.results) ? data.results.map(normalizeCity) : []
  } catch (error) {
    const fallbackResults = fallbackSearch(trimmedQuery)
    if (fallbackResults.length > 0) return fallbackResults.map(normalizeCity)
    throw new Error(error.message || 'Weather service is not available right now.')
  }
}

export async function fetchWeatherByCoordinates(city) {
  const normalizedCity = normalizeCity(city)

  if (!Number.isFinite(normalizedCity.latitude) || !Number.isFinite(normalizedCity.longitude)) {
    throw new Error('Selected city does not include valid coordinates.')
  }

  try {
    const params = new URLSearchParams({
      lat: String(normalizedCity.latitude),
      lon: String(normalizedCity.longitude),
      name: normalizedCity.name,
      country: normalizedCity.country,
    })
    const response = await fetch(`/api/weather/current?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || 'Weather service is not available right now.')
    }

    return normalizeWeather(data.weather || {}, normalizedCity)
  } catch (error) {
    const quickFallback = fallbackCities.find((cityItem) => cityItem.name === normalizedCity.name)
    if (quickFallback) return getFallbackWeather(normalizedCity)
    throw new Error(error.message || 'Weather service is not available right now.')
  }
}

export async function fetchWeatherByCity(cityName) {
  const results = await searchCities(cityName)

  if (results.length === 0) {
    throw new Error('No city found. Try a more specific name.')
  }

  return fetchWeatherByCoordinates(results[0])
}
