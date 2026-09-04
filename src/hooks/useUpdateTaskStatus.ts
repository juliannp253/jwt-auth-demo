import { useState } from 'react'
import { getApiErrorMessage } from '../services/httpClient'
import { updateTaskStatus } from '../services/taskService'
import type { Task, TaskStatus } from '../types'

interface UseUpdateTaskStatusOptions {
  onSuccess?: (updatedTask: Task) => void
}

export function useUpdateTaskStatus({ onSuccess }: UseUpdateTaskStatusOptions = {}) {
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function changeStatus(taskId: number, newStatus: TaskStatus): Promise<boolean> {
    setUpdatingTaskId(taskId)
    setError(null)

    try {
      const updated = await updateTaskStatus(taskId, newStatus)
      onSuccess?.(updated)
      return true
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
      return false
    } finally {
      setUpdatingTaskId(null)
    }
  }

  function clearError() {
    setError(null)
  }

  return {
    changeStatus,
    updatingTaskId,
    error,
    clearError,
  }
}
