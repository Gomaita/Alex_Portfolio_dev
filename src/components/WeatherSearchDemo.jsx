import { motion } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchWeatherByCity, searchCities } from '../services/weatherApi'

const quickCities = ['Alicante', 'Madrid', 'London', 'Tokyo']
const technicalBadges = [
  'React Forms',
  'API Ready',
  'Validation',
  'Error Handling',
  'Conditional UI',
  'City Suggestions',
]

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function WeatherMetric({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  )
}

function WeatherSearchDemo() {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingCities, setIsSearchingCities] = useState(false)
  const [error, setError] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadSuggestions() {
      if (!showSuggestions || city.trim().length < 2) {
        setSuggestions([])
        return
      }

      setIsSearchingCities(true)

      try {
        const cityResults = await searchCities(city)

        if (isActive) {
          setSuggestions(cityResults)
        }
      } finally {
        if (isActive) {
          setIsSearchingCities(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      isActive = false
    }
  }, [city, showSuggestions])

  async function searchWeather(cityToSearch = city) {
    const trimmedCity = cityToSearch.trim()

    if (!trimmedCity) {
      setValidationMessage('Please enter a city name before searching.')
      setError('')
      return
    }

    setCity(trimmedCity)
    setValidationMessage('')
    setError('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const weatherData = await fetchWeatherByCity(trimmedCity)
      setWeather(weatherData)
    } catch (requestError) {
      setWeather(null)
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    searchWeather()
  }

  function handleQuickCity(nextCity) {
    searchWeather(nextCity)
  }

  function handleSuggestionSelect(suggestion) {
    const nextCity = suggestion.country
      ? `${suggestion.name}, ${suggestion.country}`
      : suggestion.name

    searchWeather(nextCity)
  }

  function clearSearch() {
    setCity('')
    setSuggestions([])
    setShowSuggestions(false)
    setWeather(null)
    setError('')
    setValidationMessage('')
  }

  return (
    <motion.section
      id="weather-search"
      aria-labelledby="weather-search-title"
      aria-busy={isLoading}
      className="mb-16 overflow-hidden rounded-md border border-cyan-300/15 bg-slate-950/70 shadow-2xl shadow-slate-950/40"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            API Ready Demo
          </p>
          <h3
            id="weather-search-title"
            className="mt-3 text-3xl font-bold tracking-normal text-white sm:text-4xl"
          >
            Weather Search App
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            A weather lookup interface that demonstrates form handling,
            validation, city suggestions, API service separation, loading states
            and conditional rendering.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {technicalBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-5">
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                City name
              </span>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value)
                      setValidationMessage('')
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search city"
                    className="min-h-11 w-full rounded-md border border-white/10 bg-slate-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions((value) => !value)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Suggestions <ChevronDown size={17} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </label>

            {validationMessage && (
              <p
                className="mt-3 rounded-md border border-red-300/25 bg-red-300/10 px-3 py-2 text-sm text-red-100"
                role="alert"
              >
                {validationMessage}
              </p>
            )}
          </form>

          {showSuggestions && (
            <div className="mt-4 rounded-md border border-white/10 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-200">
                  City suggestions
                </p>
                {isSearchingCities && (
                  <p className="text-xs text-slate-400">Searching...</p>
                )}
              </div>

              {city.trim().length < 2 ? (
                <p className="mt-3 text-sm text-slate-400">
                  Type at least two letters to search cities.
                </p>
              ) : suggestions.length === 0 && !isSearchingCities ? (
                <p className="mt-3 text-sm text-slate-400">
                  No city suggestions found.
                </p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.name}-${suggestion.country}-${suggestion.state || ''}`}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="rounded-md border border-white/10 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-300">Quick search</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickCities.map((quickCity) => (
                <button
                  key={quickCity}
                  type="button"
                  onClick={() => handleQuickCity(quickCity)}
                  disabled={isLoading}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {quickCity}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={clearSearch}
            className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <X size={16} />
            Clear
          </button>
        </div>

        <div aria-live="polite">
          {isLoading && (
            <div
              className="min-h-80 animate-pulse rounded-md border border-white/10 bg-slate-950/60 p-5"
              aria-label="Loading weather data"
            >
              <div className="h-5 w-40 rounded bg-white/10" />
              <div className="mt-6 h-12 w-32 rounded bg-cyan-300/10" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-20 rounded-md bg-white/10" />
                ))}
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-md border border-red-400/25 bg-red-500/10 p-5" role="alert">
              <p className="font-semibold text-red-100">
                Weather data could not be loaded
              </p>
              <p className="mt-2 text-sm leading-6 text-red-100/80">{error}</p>
            </div>
          )}

          {!isLoading && !error && !weather && (
            <div className="flex min-h-80 items-center justify-center rounded-md border border-white/10 bg-slate-950/60 p-6 text-center">
              <div>
                <p className="text-lg font-semibold text-white">
                  Search for a city to preview weather data
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  The demo can use OpenWeatherMap with an API key. Without a
                  key, it uses a local city list and will clearly warn you when
                  a city is not available.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && weather && (
            <motion.article
              className="rounded-md border border-white/10 bg-slate-950/60 p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                    {weather.source === 'api' ? 'Live API data' : 'Local demo data'}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {weather.city}, {weather.country}
                  </h4>
                  <p className="mt-2 capitalize text-slate-300">
                    {weather.description}
                  </p>
                </div>
                <div className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-center">
                  <p className="text-4xl font-bold text-white">
                    {weather.temperature}°C
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cyan-100">
                    {weather.condition}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <WeatherMetric label="Feels like" value={`${weather.feelsLike}°C`} />
                <WeatherMetric label="Humidity" value={`${weather.humidity}%`} />
                <WeatherMetric label="Wind" value={`${weather.windSpeed} km/h`} />
                <WeatherMetric
                  label="Updated"
                  value={dateFormatter.format(new Date(weather.timestamp))}
                />
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </motion.section>
  )
}

export default WeatherSearchDemo
