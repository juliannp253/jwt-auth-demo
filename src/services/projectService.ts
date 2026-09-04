import { httpClient } from './httpClient'
import type { NewProject, Project, Task, TaskStatus } from '../types'

export async function getProjects(): Promise<Project[]> {
  const { data } = await httpClient.get<Project[]>('/projects')
  return data
}

export async function getProjectById(id: number): Promise<Project> {
  const { data } = await httpClient.get<Project>(`/projects/${id}`)
  return data
}

export async function createProject(body: NewProject): Promise<Project> {
  const { data } = await httpClient.post<Project>('/projects', body)
  return data
}

export async function deleteProject(id: number): Promise<void> {
  await httpClient.delete(`/projects/${id}`)
}

export async function getProjectTasks(projectId: number, status?: TaskStatus): Promise<Task[]> {
  const params = status ? { status } : undefined
  const { data } = await httpClient.get<Task[]>(`/projects/${projectId}/tasks`, { params })
  return data
}