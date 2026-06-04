import { motion } from 'framer-motion'
import { Clock, MapPin, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchWeatherByCoordinates, searchCities } from '../services/weatherApi'
import DemoNotice from './ui/DemoNotice'

const quickCities = [
  { name: 'Alicante', country: 'Spain', admin1: 'Valencian Community', latitude: 38.3452, longitude: -0.481, label: 'Alicante, Valencian Community, Spain' },
  { name: 'Madrid', country: 'Spain', admin1: 'Madrid', latitude: 40.4168, longitude: -3.7038, label: 'Madrid, Madrid, Spain' },
  { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5072, longitude: -0.1276, label: 'London, England, United Kingdom' },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503, label: 'Tokyo, Tokyo, Japan' },
]

const technicalBadges = ['Autocomplete', 'Open-Meteo', 'API normalization', 'Error states', 'Cloudflare Functions']

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatMetric(value, suffix = '') {
  if (value === null || value === undefined || value === 'Not available') return 'Not available'
  return `${value}${suffix}`
}

function WeatherMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  )
}

function WeatherSearchDemo() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [weather, setWeather] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [error, setError] = useState('')
  const [emptyMessage, setEmptyMessage] = useState('')

  const trimmedQuery = query.trim()

  useEffect(() => {
    if (!showSuggestions || trimmedQuery.length < 2) {
      setSuggestions([])
      setEmptyMessage('')
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true)
      setError('')
      setEmptyMessage('')

      try {
        const results = await searchCities(trimmedQuery, { signal: controller.signal })
        setSuggestions(results)
        if (results.length === 0) {
          setEmptyMessage('No city found. Try a more specific name.')
        }
      } catch {
        setSuggestions([])
        setError('Weather service is not available right now.')
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [showSuggestions, trimmedQuery])

  async function loadWeather(city) {
    setError('')
    setEmptyMessage('')
    setIsLoadingWeather(true)
    setShowSuggestions(false)
    setQuery(city.label || city.name)

    try {
      const nextWeather = await fetchWeatherByCoordinates(city)
      setWeather(nextWeather)
    } catch (requestError) {
      setWeather(null)
      setError(requestError.message || 'Weather service is not available right now.')
    } finally {
      setIsLoadingWeather(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (suggestions.length > 0) {
      loadWeather(suggestions[0])
      return
    }

    if (trimmedQuery.length < 2) {
      setEmptyMessage('Type at least two letters to search cities.')
      return
    }

    setIsSearching(true)
    setError('')

    try {
      const results = await searchCities(trimmedQuery)
      setSuggestions(results)
      if (results.length > 0) {
        loadWeather(results[0])
      } else {
        setWeather(null)
        setEmptyMessage('No city found. Try a more specific name.')
        setShowSuggestions(true)
      }
    } catch {
      setWeather(null)
      setError('Weather service is not available right now.')
    } finally {
      setIsSearching(false)
    }
  }

  function clearSearch() {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setWeather(null)
    setError('')
    setEmptyMessage('')
  }

  const updatedAt = useMemo(() => {
    if (!weather?.updatedAt || weather.updatedAt === 'Not available') return 'Not available'
    return dateFormatter.format(new Date(weather.updatedAt))
  }, [weather])

  return (
    <motion.section
      id="weather-search"
      aria-labelledby="weather-search-title"
      aria-busy={isSearching || isLoadingWeather}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
          API search demo
        </p>
        <h3 id="weather-search-title" className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
          Weather Search App
        </h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          Weather search demo with city autocomplete, API data normalization and clear conditional UI states.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {technicalBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
        <DemoNotice className="lg:col-span-2">
          This demo uses city search, API data normalization and conditional UI states.
        </DemoNotice>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">City search</span>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setShowSuggestions(true)
                    setError('')
                    setEmptyMessage('')
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search any city"
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-24 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
                />
                <button
                  type="submit"
                  disabled={isSearching || isLoadingWeather}
                  className="absolute right-1.5 top-1/2 inline-flex min-h-8 -translate-y-1/2 items-center justify-center rounded-md bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
                >
                  {isSearching ? 'Searching' : 'Search'}
                </button>

                {showSuggestions && (trimmedQuery.length >= 2 || suggestions.length > 0) && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-950">
                    {isSearching ? (
                      <p className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">Searching cities...</p>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => loadWeather(suggestion)}
                          className="block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none dark:border-slate-800 dark:hover:bg-slate-800"
                        >
                          <span className="block text-sm font-semibold text-slate-950 dark:text-white">{suggestion.name}</span>
                          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                            {[suggestion.admin1, suggestion.country].filter(Boolean).join(', ')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        No city found. Try a more specific name.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </label>
          </form>

          {(emptyMessage || error) && (
            <p className={`mt-3 rounded-lg border px-3 py-2 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200' : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}>
              {error || emptyMessage}
            </p>
          )}

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Quick cities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickCities.map((quickCity) => (
                <button
                  key={quickCity.name}
                  type="button"
                  onClick={() => loadWeather(quickCity)}
                  disabled={isLoadingWeather}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
                >
                  {quickCity.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={clearSearch}
            className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
          >
            <X size={16} />
            Clear
          </button>
        </div>

        <div aria-live="polite">
          {isLoadingWeather ? (
            <div className="min-h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-6 h-12 w-32 rounded bg-blue-100 dark:bg-slate-800" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          ) : !weather ? (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <MapPin className="mx-auto text-blue-600 dark:text-sky-300" size={28} />
                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">Search for a city</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Start typing to get autocomplete suggestions, then select a city to load current weather.
                </p>
              </div>
            </div>
          ) : (
            <motion.article
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
                    {weather.isFallback ? 'Fallback data' : 'Open-Meteo data'}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                    {weather.city}{weather.country ? `, ${weather.country}` : ''}
                  </h4>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{weather.description}</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-center dark:border-sky-800 dark:bg-sky-950/50">
                  <p className="text-4xl font-bold text-slate-950 dark:text-white">
                    {formatMetric(weather.temperature, '°C')}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-700 dark:text-sky-200">Current</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <WeatherMetric label="Feels like" value={formatMetric(weather.feelsLike, '°C')} />
                <WeatherMetric label="Humidity" value={formatMetric(weather.humidity, '%')} />
                <WeatherMetric label="Wind" value={formatMetric(weather.windSpeed, ' km/h')} />
                <WeatherMetric label="Last updated" value={updatedAt} />
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
                <span>Data source: {weather.source}</span>
                <span>
                  Coordinates: {Number(weather.latitude).toFixed(3)}, {Number(weather.longitude).toFixed(3)}
                </span>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </motion.section>
  )
}

export default WeatherSearchDemo
