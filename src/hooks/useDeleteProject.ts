import { useState } from 'react'
import { getApiErrorMessage } from '../services/httpClient'
import { deleteProject } from '../services/projectService'

interface UseDeleteProjectOptions {
  onSuccess?: (deletedProjectId: number) => void
}

export function useDeleteProject({ onSuccess }: UseDeleteProjectOptions = {}) {
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function removeProject(projectId: number): Promise<boolean> {
    setDeletingProjectId(projectId)
    setError(null)

    try {
      await deleteProject(projectId)
      onSuccess?.(projectId)
      return true
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
      return false
    } finally {
      setDeletingProjectId(null)
    }
  }

  function clearError() {
    setError(null)
  }

  return {
    removeProject,
    deletingProjectId,
    error,
    clearError,
  }
}
