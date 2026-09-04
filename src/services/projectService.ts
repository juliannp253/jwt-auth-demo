import { httpClient } from './httpClient'
import type { NewProject, Project } from '../types'

/**
 * Lista todos los proyectos (GET /projects)
 */
export async function getProjects(): Promise<Project[]> {
  const { data } = await httpClient.get<Project[]>('/projects')
  return data
}

/**
 * Crea un nuevo proyecto (POST /projects)
 */
export async function createProject(body: NewProject): Promise<Project> {
  const { data } = await httpClient.post<Project>('/projects', body)
  return data
}

/**
 * Elimina un proyecto y sus tareas asociadas en cascada (DELETE /projects/{id})
 * Nota: Solo el owner o un ADMIN tienen permisos. De lo contrario responde 403.
 */
export async function deleteProject(id: number): Promise<void> {
  await httpClient.delete(`/projects/${id}`)
}