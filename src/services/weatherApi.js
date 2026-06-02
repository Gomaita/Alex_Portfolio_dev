const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

const supportedCities = [
  { name: 'Alicante', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 24, feelsLike: 25, humidity: 58, windSpeed: 12 },
  { name: 'Madrid', country: 'ES', condition: 'Cloudy', description: 'few clouds', temperature: 19, feelsLike: 18, humidity: 44, windSpeed: 10 },
  { name: 'Barcelona', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 22, feelsLike: 22, humidity: 61, windSpeed: 11 },
  { name: 'Valencia', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 23, feelsLike: 24, humidity: 63, windSpeed: 13 },
  { name: 'Seville', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 27, feelsLike: 28, humidity: 39, windSpeed: 9 },
  { name: 'Bilbao', country: 'ES', condition: 'Rain', description: 'light rain', temperature: 16, feelsLike: 15, humidity: 78, windSpeed: 14 },
  { name: 'Malaga', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 25, feelsLike: 26, humidity: 55, windSpeed: 10 },
  { name: 'Murcia', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 26, feelsLike: 27, humidity: 42, windSpeed: 12 },
  { name: 'Zaragoza', country: 'ES', condition: 'Cloudy', description: 'scattered clouds', temperature: 20, feelsLike: 19, humidity: 47, windSpeed: 18 },
  { name: 'Granada', country: 'ES', condition: 'Sunny', description: 'clear sky', temperature: 21, feelsLike: 20, humidity: 40, windSpeed: 8 },
  { name: 'London', country: 'GB', condition: 'Rain', description: 'light rain', temperature: 13, feelsLike: 12, humidity: 76, windSpeed: 16 },
  { name: 'Paris', country: 'FR', condition: 'Cloudy', description: 'broken clouds', temperature: 15, feelsLike: 14, humidity: 69, windSpeed: 11 },
  { name: 'Berlin', country: 'DE', condition: 'Cloudy', description: 'overcast clouds', temperature: 14, feelsLike: 13, humidity: 66, windSpeed: 13 },
  { name: 'Rome', country: 'IT', condition: 'Sunny', description: 'clear sky', temperature: 23, feelsLike: 23, humidity: 52, windSpeed: 9 },
  { name: 'Lisbon', country: 'PT', condition: 'Sunny', description: 'clear sky', temperature: 21, feelsLike: 21, humidity: 59, windSpeed: 17 },
  { name: 'Amsterdam', country: 'NL', condition: 'Rain', description: 'light rain', temperature: 12, feelsLike: 11, humidity: 81, windSpeed: 19 },
  { name: 'Brussels', country: 'BE', condition: 'Cloudy', description: 'broken clouds', temperature: 13, feelsLike: 12, humidity: 74, windSpeed: 14 },
  { name: 'Dublin', country: 'IE', condition: 'Rain', description: 'moderate rain', temperature: 11, feelsLike: 10, humidity: 83, windSpeed: 22 },
  { name: 'Copenhagen', country: 'DK', condition: 'Cloudy', description: 'scattered clouds', temperature: 10, feelsLike: 9, humidity: 70, windSpeed: 20 },
  { name: 'Stockholm', country: 'SE', condition: 'Cloudy', description: 'broken clouds', temperature: 8, feelsLike: 6, humidity: 67, windSpeed: 15 },
  { name: 'Oslo', country: 'NO', condition: 'Cloudy', description: 'overcast clouds', temperature: 7, feelsLike: 5, humidity: 72, windSpeed: 12 },
  { name: 'Vienna', country: 'AT', condition: 'Sunny', description: 'clear sky', temperature: 17, feelsLike: 16, humidity: 55, windSpeed: 10 },
  { name: 'Prague', country: 'CZ', condition: 'Cloudy', description: 'few clouds', temperature: 14, feelsLike: 13, humidity: 58, windSpeed: 12 },
  { name: 'Warsaw', country: 'PL', condition: 'Cloudy', description: 'scattered clouds', temperature: 13, feelsLike: 12, humidity: 62, windSpeed: 13 },
  { name: 'Athens', country: 'GR', condition: 'Sunny', description: 'clear sky', temperature: 26, feelsLike: 27, humidity: 46, windSpeed: 9 },
  { name: 'New York', country: 'US', condition: 'Cloudy', description: 'broken clouds', temperature: 18, feelsLike: 18, humidity: 60, windSpeed: 15 },
  { name: 'Los Angeles', country: 'US', condition: 'Sunny', description: 'clear sky', temperature: 24, feelsLike: 24, humidity: 49, windSpeed: 10 },
  { name: 'Chicago', country: 'US', condition: 'Wind', description: 'windy', temperature: 12, feelsLike: 10, humidity: 56, windSpeed: 28 },
  { name: 'Miami', country: 'US', condition: 'Rain', description: 'light rain', temperature: 27, feelsLike: 30, humidity: 78, windSpeed: 18 },
  { name: 'Toronto', country: 'CA', condition: 'Cloudy', description: 'overcast clouds', temperature: 10, feelsLike: 8, humidity: 65, windSpeed: 17 },
  { name: 'Vancouver', country: 'CA', condition: 'Rain', description: 'light rain', temperature: 9, feelsLike: 7, humidity: 82, windSpeed: 14 },
  { name: 'Mexico City', country: 'MX', condition: 'Cloudy', description: 'scattered clouds', temperature: 20, feelsLike: 20, humidity: 51, windSpeed: 9 },
  { name: 'Buenos Aires', country: 'AR', condition: 'Cloudy', description: 'few clouds', temperature: 17, feelsLike: 16, humidity: 57, windSpeed: 16 },
  { name: 'Sao Paulo', country: 'BR', condition: 'Rain', description: 'light rain', temperature: 22, feelsLike: 23, humidity: 75, windSpeed: 12 },
  { name: 'Tokyo', country: 'JP', condition: 'Cloudy', description: 'scattered clouds', temperature: 21, feelsLike: 22, humidity: 68, windSpeed: 9 },
  { name: 'Kyoto', country: 'JP', condition: 'Cloudy', description: 'few clouds', temperature: 20, feelsLike: 20, humidity: 65, windSpeed: 8 },
  { name: 'Seoul', country: 'KR', condition: 'Sunny', description: 'clear sky', temperature: 19, feelsLike: 18, humidity: 49, windSpeed: 11 },
  { name: 'Beijing', country: 'CN', condition: 'Cloudy', description: 'haze', temperature: 18, feelsLike: 17, humidity: 44, windSpeed: 10 },
  { name: 'Shanghai', country: 'CN', condition: 'Rain', description: 'light rain', temperature: 21, feelsLike: 22, humidity: 73, windSpeed: 13 },
  { name: 'Singapore', country: 'SG', condition: 'Rain', description: 'thunderstorm', temperature: 29, feelsLike: 34, humidity: 82, windSpeed: 10 },
  { name: 'Sydney', country: 'AU', condition: 'Sunny', description: 'clear sky', temperature: 22, feelsLike: 22, humidity: 55, windSpeed: 14 },
  { name: 'Melbourne', country: 'AU', condition: 'Cloudy', description: 'broken clouds', temperature: 16, feelsLike: 15, humidity: 63, windSpeed: 17 },
  { name: 'Cape Town', country: 'ZA', condition: 'Wind', description: 'windy', temperature: 18, feelsLike: 17, humidity: 58, windSpeed: 26 },
  { name: 'Cairo', country: 'EG', condition: 'Sunny', description: 'clear sky', temperature: 30, feelsLike: 29, humidity: 31, windSpeed: 12 },
]

function normalizeText(value) {
  return value.trim().toLowerCase()
}

function normalizeCityResult(city) {
  return {
    name: city.name,
    country: city.country,
    label: `${city.name}, ${city.country}`,
  }
}

function mapOpenWeatherResponse(data) {
  return {
    city: data.name,
    country: data.sys?.country || '',
    temperature: Math.round(data.main?.temp ?? 0),
    feelsLike: Math.round(data.main?.feels_like ?? 0),
    humidity: data.main?.humidity ?? 0,
    windSpeed: Math.round((data.wind?.speed ?? 0) * 3.6),
    description: data.weather?.[0]?.description || 'weather data unavailable',
    condition: data.weather?.[0]?.main || 'Weather',
    timestamp: new Date().toISOString(),
    source: 'api',
  }
}

function mapMockWeather(city) {
  return {
    city: city.name,
    country: city.country,
    temperature: city.temperature,
    feelsLike: city.feelsLike,
    humidity: city.humidity,
    windSpeed: city.windSpeed,
    description: city.description,
    condition: city.condition,
    timestamp: new Date().toISOString(),
    source: 'mock',
  }
}

function findLocalCity(cityName) {
  const normalizedCity = normalizeText(cityName)

  return supportedCities.find(
    (city) =>
      normalizeText(city.name) === normalizedCity ||
      normalizeText(`${city.name}, ${city.country}`) === normalizedCity,
  )
}

export async function searchCities(query) {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length < 2) {
    return []
  }

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (apiKey) {
    try {
      const response = await fetch(
        `${OPENWEATHER_GEO_URL}?q=${encodeURIComponent(
          trimmedQuery,
        )}&limit=8&appid=${apiKey}`,
      )

      if (response.ok) {
        const data = await response.json()

        return data.map((city) => ({
          name: city.name,
          country: city.country || '',
          state: city.state || '',
          lat: city.lat,
          lon: city.lon,
          label: [city.name, city.state, city.country].filter(Boolean).join(', '),
        }))
      }
    } catch {
      return []
    }
  }

  const normalizedQuery = normalizeText(trimmedQuery)

  return supportedCities
    .filter((city) =>
      normalizeText(`${city.name} ${city.country}`).includes(normalizedQuery),
    )
    .slice(0, 8)
    .map(normalizeCityResult)
}

export async function fetchWeatherByCity(city) {
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    throw new Error('Please enter a city name before searching.')
  }

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    const localCity = findLocalCity(trimmedCity)

    if (!localCity) {
      throw new Error('This city does not exist in the local demo list. Try selecting one from the suggestions.')
    }

    return mapMockWeather(localCity)
  }

  let geoResponse

  try {
    geoResponse = await fetch(
      `${OPENWEATHER_GEO_URL}?q=${encodeURIComponent(
        trimmedCity,
      )}&limit=1&appid=${apiKey}`,
    )
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  if (geoResponse.status === 401) {
    throw new Error('OpenWeatherMap API key is missing or invalid.')
  }

  if (!geoResponse.ok) {
    throw new Error('Weather service error. Please try again later.')
  }

  const geoData = await geoResponse.json()

  if (!Array.isArray(geoData) || geoData.length === 0) {
    throw new Error('This city does not exist. Check the spelling or choose a suggestion.')
  }

  const [location] = geoData
  const weatherUrl = `${OPENWEATHER_URL}?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=en`

  let weatherResponse

  try {
    weatherResponse = await fetch(weatherUrl)
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  if (weatherResponse.status === 401) {
    throw new Error('OpenWeatherMap API key is missing or invalid.')
  }

  if (!weatherResponse.ok) {
    throw new Error('Weather service error. Please try again later.')
  }

  const weatherData = await weatherResponse.json()
  return mapOpenWeatherResponse(weatherData)
}
