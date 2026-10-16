export type TaskStatus = 'open' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
}

export function completeTask(task: Task): Task {
  return { ...task, status: 'done' }
}
