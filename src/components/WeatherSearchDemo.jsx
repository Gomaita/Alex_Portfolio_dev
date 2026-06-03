import { motion } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchWeatherByCity, searchCities } from '../services/weatherApi'
import DemoNotice from './ui/DemoNotice'

const quickCities = ['Alicante', 'Madrid', 'London', 'Tokyo']
const technicalBadges = ['Forms', 'API ready', 'Validation', 'Loading states', 'Fallback data']

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function WeatherMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
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
        if (isActive) setSuggestions(cityResults)
      } finally {
        if (isActive) setIsSearchingCities(false)
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
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          API-ready demo
        </p>
        <h3
          id="weather-search-title"
          className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl"
        >
          Weather Search App
        </h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          A weather lookup interface built to practice forms, validation,
          service separation and clear loading or error states.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {technicalBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <DemoNotice className="lg:col-span-2">
          API demo. Data may depend on external service availability.
        </DemoNotice>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">City name</span>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                    className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions((value) => !value)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                >
                  Suggestions <ChevronDown size={17} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </label>

            {validationMessage && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {validationMessage}
              </p>
            )}
          </form>

          {showSuggestions && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">
                  City suggestions
                </p>
                {isSearchingCities && (
                  <p className="text-xs text-slate-500">Searching...</p>
                )}
              </div>
              {city.trim().length < 2 ? (
                <p className="mt-3 text-sm text-slate-600">
                  Type at least two letters to search cities.
                </p>
              ) : suggestions.length === 0 && !isSearchingCities ? (
                <p className="mt-3 text-sm text-slate-600">
                  No city suggestions found.
                </p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.name}-${suggestion.country}-${suggestion.state || ''}`}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700">Quick search</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickCities.map((quickCity) => (
                <button
                  key={quickCity}
                  type="button"
                  onClick={() => searchWeather(quickCity)}
                  disabled={isLoading}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {quickCity}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={clearSearch}
            className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            <X size={16} />
            Clear
          </button>
        </div>

        <div aria-live="polite">
          {isLoading && (
            <div className="min-h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-6 h-12 w-32 rounded bg-blue-100" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-20 rounded-xl bg-slate-100" />
                ))}
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-700">
                Weather data could not be loaded
              </p>
              <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && !weather && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div>
                <p className="text-lg font-semibold text-slate-950">
                  Search for a city to preview weather data
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  The demo can use OpenWeatherMap with an API key. Without a
                  key, it uses local demo data and keeps the state clear.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && weather && (
            <motion.article
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                    {weather.source === 'api' ? 'Live API data' : 'Local demo data'}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold text-slate-950">
                    {weather.city}, {weather.country}
                  </h4>
                  <p className="mt-2 capitalize text-slate-600">
                    {weather.description}
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-center">
                  <p className="text-4xl font-bold text-slate-950">
                    {weather.temperature}°C
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-700">
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
