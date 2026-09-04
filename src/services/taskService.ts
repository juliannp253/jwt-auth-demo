import { httpClient } from './httpClient'
import type { Task, TaskRequest, TaskStatus } from '../types'

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

export async function updateTask(id: number, body: TaskRequest): Promise<Task> {
  const { data } = await httpClient.put<Task>(`/tasks/${id}`, body)
  return data
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const { data } = await httpClient.patch<Task>(`/tasks/${id}/status`, { status })
  return data
}

export async function deleteTask(id: number): Promise<void> {
  await httpClient.delete(`/tasks/${id}`)
}
