import { useState } from 'react'
import { getApiErrorMessage } from '../services/httpClient'
import { deleteTask } from '../services/taskService'

interface UseDeleteTaskOptions {
  onSuccess?: (deletedTaskId: number) => void
}

export function useDeleteTask({ onSuccess }: UseDeleteTaskOptions = {}) {
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function removeTask(taskId: number): Promise<boolean> {
    setDeletingTaskId(taskId)
    setError(null)

    try {
      await deleteTask(taskId)
      onSuccess?.(taskId)
      return true
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
      return false
    } finally {
      setDeletingTaskId(null)
    }
  }

  function clearError() {
    setError(null)
  }

  return {
    removeTask,
    deletingTaskId,
    error,
    clearError,
  }
}
