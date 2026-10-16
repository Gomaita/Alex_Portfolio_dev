import type { Task } from '../domain/task'

// An in-memory adapter for this first-party sample only.
export function createTaskStore() {
  const tasks = new Map<string, Task>()
  return {
    get: (id: string) => tasks.get(id),
    save: (task: Task) => {
      tasks.set(task.id, task)
      return task
    },
    list: () => [...tasks.values()],
  }
}
