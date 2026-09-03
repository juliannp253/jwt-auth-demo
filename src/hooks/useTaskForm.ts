import { useState } from 'react'
import { getApiErrorMessage } from '../services/httpClient'
import { createTask } from '../services/taskService'
import type { Task, TaskPriority } from '../types'

interface UseTaskFormOptions {
  initialProjectId?: number | null
  onSuccess?: (task: Task) => void
}

export function useTaskForm({ initialProjectId = null, onSuccess }: UseTaskFormOptions = {}) {
  const [projectId, setProjectId] = useState<number | ''>(initialProjectId ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MED')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = Boolean(projectId) && title.trim().length >= 3

  function reset() {
    setTitle('')
    setDescription('')
    setPriority('MED')
    setDueDate('')
    setAssigneeId('')
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
        assigneeId: assigneeId ? Number(assigneeId) : null,
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
