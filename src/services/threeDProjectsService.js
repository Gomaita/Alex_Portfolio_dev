import { apiGet } from './apiClient'
import { threeDProjectsFallback } from '../data/threeDProjectsFallback'

export async function getPublished3DProjects() {
  try {
    const data = await apiGet('/api/3d/projects')
    const projects = data?.projects || []
    return projects
  } catch {
    return threeDProjectsFallback
  }
}

export async function getPublished3DProjectBySlug(slug) {
  try {
    const data = await apiGet(`/api/3d/projects/${slug}`)
    return data?.project || threeDProjectsFallback.find((project) => project.slug === slug) || null
  } catch {
    return threeDProjectsFallback.find((project) => project.slug === slug) || null
  }
}
