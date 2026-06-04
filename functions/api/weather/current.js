import { errorResponse, jsonResponse } from '../../_utils/response.js'
import { sanitizeText } from '../../_utils/sanitize.js'

const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
}

function parseCoordinate(value, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < min || number > max) return null
  return number
}

function formatValue(value) {
  return value === null || value === undefined ? 'Not available' : value
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const latitude = parseCoordinate(url.searchParams.get('lat'), -90, 90)
  const longitude = parseCoordinate(url.searchParams.get('lon'), -180, 180)
  const city = sanitizeText(url.searchParams.get('name') || 'Selected city', 80)
  const country = sanitizeText(url.searchParams.get('country') || '', 80)

  if (latitude === null || longitude === null) {
    return errorResponse('Valid latitude and longitude are required.', 400)
  }

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
  )

  if (!response.ok) {
    return errorResponse('Weather service is not available right now.', 502)
  }

  const data = await response.json()
  const current = data.current || {}
  const weatherCode = current.weather_code

  return jsonResponse({
    ok: true,
    weather: {
      city,
      country,
      temperature: formatValue(current.temperature_2m),
      feelsLike: formatValue(current.apparent_temperature),
      humidity: formatValue(current.relative_humidity_2m),
      windSpeed: formatValue(current.wind_speed_10m),
      weatherCode: formatValue(weatherCode),
      description: weatherDescriptions[weatherCode] || 'Weather data available',
      updatedAt: current.time || new Date().toISOString(),
      latitude,
      longitude,
      source: 'Open-Meteo',
    },
  })
}
