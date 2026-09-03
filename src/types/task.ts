export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MED' | 'HIGH'

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: number
  assigneeId?: number | null
  dueDate?: string | null
}
