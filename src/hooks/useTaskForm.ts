import { useState } from 'react'
import { getApiErrorMessage } from '../services/httpClient'
import { createTask } from '../services/taskService'
import type { Task, TaskPriority } from '../types'

interface UseTaskFormOptions {
  initialProjectId?: number | null
  initialAssigneeId?: number | null
  onSuccess?: (task: Task) => void
}

export function useTaskForm({
  initialProjectId = null,
  initialAssigneeId = null,
  onSuccess,
}: UseTaskFormOptions = {}) {
  const [projectId, setProjectId] = useState<number | ''>(initialProjectId ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MED')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState<number | ''>(initialAssigneeId ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validación: Proyecto, Título (mín. 3 letras) y Responsable son OBLIGATORIOS
  const isValid = Boolean(projectId) && title.trim().length >= 3 && Boolean(assigneeId)

  function reset() {
    setTitle('')
    setDescription('')
    setPriority('MED')
    setDueDate('')
    setAssigneeId(initialAssigneeId ?? '')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const newTask = await createTask(Number(projectId), {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || null,
        assigneeId: Number(assigneeId),
      })

      reset()
      onSuccess?.(newTask)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    projectId,
    setProjectId,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    assigneeId,
    setAssigneeId,
    submitting,
    error,
    isValid,
    handleSubmit,
    reset,
  }
}
