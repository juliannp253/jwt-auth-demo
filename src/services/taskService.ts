import { httpClient } from './httpClient'
import type { Task, TaskRequest, TaskStatus } from '../types'

/**
 * Obtiene todas las tareas (GET /tasks)
 */
export async function getTasks(): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>('/tasks')
  return data
}

/**
 * Obtiene los detalles de una tarea por su ID (GET /tasks/{id})
 */
export async function getTaskById(id: number): Promise<Task> {
  const { data } = await httpClient.get<Task>(`/tasks/${id}`)
  return data
}

/**
 * Crea una nueva tarea dentro de un proyecto específico (POST /projects/{projectId}/tasks)
 */
export async function createTask(projectId: number, body: TaskRequest): Promise<Task> {
  const { data } = await httpClient.post<Task>(`/projects/${projectId}/tasks`, body)
  return data
}

/**
 * Reemplaza o edita una tarea por completo (PUT /tasks/{id})
 * Conserva id, status y projectId; permite modificar título, descripción, prioridad, responsable y fecha.
 */
export async function updateTask(id: number, body: TaskRequest): Promise<Task> {
  const { data } = await httpClient.put<Task>(`/tasks/${id}`, body)
  return data
}

/**
 * Cambia el estado de una tarea (PATCH /tasks/{id}/status)
 * Nota del backend: Cambiar a DONE sin responsable asignado responde error 422.
 */
export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const { data } = await httpClient.patch<Task>(`/tasks/${id}/status`, { status })
  return data
}
