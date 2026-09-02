import { httpClient } from './httpClient'
import type { Task } from '../types'

export async function getTasks(): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>('/tasks')
  return data
}

export async function getTaskById(id: number): Promise<Task> {
  const { data } = await httpClient.get<Task>(`/tasks/${id}`)
  return data
}
