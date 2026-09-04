import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router-dom'

import { Navbar } from '../components/Navbar'
import { TaskCardDetail } from '../components/TaskCardDetail'
import { useProjects } from '../hooks/useProjects'
import { getTaskById } from '../services/taskService'
import type { Task } from '../types'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects } = useProjects()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const taskId = Number(id)
    if (isNaN(taskId)) {
      setError('El ID de tarea proporcionado no es válido.')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getTaskById(taskId)
      .then((data) => {
        if (!cancelled) setTask(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : `No se pudo encontrar la tarea con ID ${taskId}`
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const project = task ? projects.find((p) => p.id === task.projectId) : null
  const projectName = project ? project.name : (task ? `Proyecto #${task.projectId}` : '')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      <Navbar />

      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/tasks')}
              size="small"
            >
              Volver a Tareas
            </Button>
            <Button
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              size="small"
              color="inherit"
            >
              Dashboard
            </Button>
          </Stack>
        </Stack>

        {loading && (
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" mt={2}>
              Consultando detalle de la tarea desde GET /tasks/{id}...
            </Typography>
          </Card>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && task && (
          <TaskCardDetail
            task={task}
            projectName={projectName}
            projectDescription={project?.description}
            onStatusUpdated={(updated) => setTask(updated)}
            onTaskDeleted={() => navigate('/tasks')}
          />
        )}
      </Container>
    </Box>
  )
}
