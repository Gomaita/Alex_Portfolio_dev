export type Layer = 'Entry' | 'Transport' | 'Service' | 'Domain' | 'Data' | 'Utility' | 'Config'
export interface SourceSymbol { name: string; kind: string; startLine: number; endLine: number }
export interface SourceFile {
  id: string; path: string; language: 'TypeScript'; layer: Layer; description: string
  source: string; sha256: string; lines: number; symbols: SourceSymbol[]
  position: { x: number; y: number }
}
export interface DependencyEdge { id: string; source: string; target: string; line: number; kind: 'import' | 'type-import' }
export interface RepositorySnapshot {
  schemaVersion: 1
  repository: { name: string; version: string; provenance: string; description: string }
  snapshotHash: string
  status: 'local-fixture'
  files: SourceFile[]
  edges: DependencyEdge[]
}
