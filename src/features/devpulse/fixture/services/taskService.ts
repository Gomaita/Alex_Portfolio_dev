import { completeTask, type Task } from '../domain/task'
import { createTaskStore } from '../data/taskStore'
import { parseTitle } from '../lib/validation'

export function createTaskService(store: ReturnType<typeof createTaskStore>) {
  return {
    create(id: string, input: unknown): Task {
      return store.save({ id, title: parseTitle(input), status: 'open' })
    },
    complete(id: string): Task {
      const task = store.get(id)
      if (!task) throw new Error('Task not found')
      return store.save(completeTask(task))
    },
    list: store.list,
  }
}
