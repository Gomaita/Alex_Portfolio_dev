const DEFAULT_GITHUB_USERNAME = 'Gomaita'

const fallbackRepos = [
  {
    id: 'mock-market-dashboard',
    name: 'market-api-dashboard',
    description:
      'Crypto market dashboard with API consumption, responsive cards and Recharts visualization.',
    language: 'JavaScript',
    stars: 12,
    forks: 3,
    updatedAt: '2026-05-18T10:00:00Z',
    url: 'https://github.com/',
    topics: ['react', 'api', 'recharts'],
    isMock: true,
  },
  {
    id: 'mock-project-manager',
    name: 'project-manager-crud',
    description:
      'Local project management demo with CRUD operations, filters and localStorage persistence.',
    language: 'JavaScript',
    stars: 9,
    forks: 2,
    updatedAt: '2026-05-16T12:30:00Z',
    url: 'https://github.com/',
    topics: ['react', 'crud', 'localstorage'],
    isMock: true,
  },
  {
    id: 'mock-weather-search',
    name: 'weather-search-app',
    description:
      'Weather lookup interface with validation, API-ready service layer and fallback data.',
    language: 'JavaScript',
    stars: 7,
    forks: 1,
    updatedAt: '2026-05-12T09:20:00Z',
    url: 'https://github.com/',
    topics: ['react', 'forms', 'weather-api'],
    isMock: true,
  },
  {
    id: 'mock-portfolio',
    name: 'alex-portfolio',
    description:
      'Personal developer portfolio with routing, animation and interactive technical demos.',
    language: 'CSS',
    stars: 15,
    forks: 4,
    updatedAt: '2026-05-20T16:10:00Z',
    url: 'https://github.com/',
    topics: ['portfolio', 'vite', 'tailwindcss'],
    isMock: true,
  },
]

function normalizeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description || 'No repository description provided.',
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count ?? repo.stars ?? 0,
    forks: repo.forks_count ?? repo.forks ?? 0,
    updatedAt: repo.updated_at ?? repo.updatedAt,
    url: repo.html_url ?? repo.url,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    isMock: Boolean(repo.isMock),
  }
}

function getFallbackRepos() {
  return fallbackRepos.map(normalizeRepo)
}

export async function fetchGitHubRepos(username = DEFAULT_GITHUB_USERNAME) {
  const normalizedUsername = username.trim() || DEFAULT_GITHUB_USERNAME
  const url = `https://api.github.com/users/${encodeURIComponent(
    normalizedUsername,
  )}/repos?sort=updated&per_page=8`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return getFallbackRepos()
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      return getFallbackRepos()
    }

    return data.map(normalizeRepo)
  } catch {
    return getFallbackRepos()
  }
}

export { DEFAULT_GITHUB_USERNAME }
