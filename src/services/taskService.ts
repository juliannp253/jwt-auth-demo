import { httpClient } from './httpClient'
import type { Task, TaskRequest } from '../types'

export async function getTasks(): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>('/tasks')
  return data
}

export async function getTaskById(id: number): Promise<Task> {
  const { data } = await httpClient.get<Task>(`/tasks/${id}`)
  return data
}

export async function createTask(projectId: number, body: TaskRequest): Promise<Task> {
  const { data } = await httpClient.post<Task>(`/projects/${projectId}/tasks`, body)
  return data
}
