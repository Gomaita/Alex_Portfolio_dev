import { createTaskService } from '../services/taskService'

// Transport-independent commands; this is not a running HTTP API.
export function createRouter(service: ReturnType<typeof createTaskService>) {
  return {
    list: () => service.list(),
    create: (id: string, title: unknown) => service.create(id, title),
    complete: (id: string) => service.complete(id),
  }
}
