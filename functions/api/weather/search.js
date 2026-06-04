import { errorResponse, jsonResponse } from '../../_utils/response.js'
import { sanitizeText } from '../../_utils/sanitize.js'

function normalizeCity(city) {
  return {
    id: `${city.id || `${city.latitude}-${city.longitude}`}`,
    name: city.name,
    country: city.country || '',
    admin1: city.admin1 || '',
    latitude: city.latitude,
    longitude: city.longitude,
    label: [city.name, city.admin1, city.country].filter(Boolean).join(', '),
  }
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const query = sanitizeText(url.searchParams.get('q') || '', 80)

  if (query.length < 2) {
    return errorResponse('Search query must contain at least 2 characters.', 400)
  }

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query,
    )}&count=8&language=en&format=json`,
  )

  if (!response.ok) {
    return errorResponse('Weather city search is not available right now.', 502)
  }

  const data = await response.json()
  const results = Array.isArray(data.results) ? data.results.map(normalizeCity) : []

  return jsonResponse({
    ok: true,
    results,
    ...(results.length === 0 ? { message: 'No cities found.' } : {}),
  })
}
