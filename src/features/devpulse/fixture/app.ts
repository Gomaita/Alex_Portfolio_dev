import { createRouter } from './api/router'
import { createTaskStore } from './data/taskStore'
import { createTaskService } from './services/taskService'
import { config } from './config'

export function createApp() {
  const store = createTaskStore()
  const service = createTaskService(store)
  return { name: config.projectName, router: createRouter(service) }
}
