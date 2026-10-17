import raw from './snapshot.json'
import type { RepositorySnapshot } from './types'

export const repository = raw as RepositorySnapshot
export const files = repository.files
export const edges = repository.edges
export const findFile = (id: string | null) => files.find(file => file.id === id)
export const incoming = (id: string) => edges.filter(edge => edge.target === id)
export const outgoing = (id: string) => edges.filter(edge => edge.source === id)
export const metrics = {
  files: files.length,
  lines: files.reduce((sum, file) => sum + file.lines, 0),
  symbols: files.reduce((sum, file) => sum + file.symbols.length, 0),
  imports: edges.length,
}
