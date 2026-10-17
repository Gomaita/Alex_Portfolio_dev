import { config } from '../config'

export function parseTitle(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('A title is required')
  }
  const title = input.trim()
  if (!title || title.length > config.maxTitleLength) {
    throw new Error('Title length is outside the allowed range')
  }
  return title
}
