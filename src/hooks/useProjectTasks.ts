import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../services/httpClient'
import { getProjectTasks } from '../services/projectService'
import type { Task, TaskStatus } from '../types'

export function useProjectTasks(projectId: number | null, status?: TaskStatus) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getProjectTasks(projectId, status)
      setTasks(data)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [projectId, status])

  useEffect(() => {
    let cancelled = false

    if (!projectId) {
      return
    }

    getProjectTasks(projectId, status)
      .then((data) => {
        if (!cancelled) {
          setTasks(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err))
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId, status])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  }
}
