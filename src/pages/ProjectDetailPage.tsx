import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router-dom'

import { Navbar } from '../components/Navbar'
import { TaskFormDialog } from '../components/TaskFormDialog'
import { TaskList } from '../components/TaskList'
import { useAuth } from '../hooks/useAuth'
import { useDeleteProject } from '../hooks/useDeleteProject'
import { useProjectTasks } from '../hooks/useProjectTasks'
import { getApiErrorMessage } from '../services/httpClient'
import { getProjectById } from '../services/projectService'
import type { Project } from '../types'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [project, setProject] = useState<Project | null>(null)
  const [loadingProject, setLoadingProject] = useState(true)
  const [projectError, setProjectError] = useState<string | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  const {
    tasks,
    loading: loadingTasks,
    error: errorTasks,
    refetch: refetchTasks,
  } = useProjectTasks(projectId)

  const {
    removeProject,
    deletingProjectId,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteProject({
    onSuccess: () => {
      navigate('/dashboard')
    },
  })

  useEffect(() => {
    if (!projectId) return

    let cancelled = false
    setLoadingProject(true)
    setProjectError(null)

    getProjectById(projectId)
      .then((data) => {
        if (!cancelled) setProject(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setProjectError(getApiErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoadingProject(false)
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  const isOwner = user?.id === project?.ownerId

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      <Navbar />

      <Container maxWidth="md">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Button
            size="small"
            onClick={() => navigate('/dashboard')}
            sx={{ textTransform: 'none' }}
          >
            ← Volver al Dashboard
          </Button>
        </Stack>

        {deleteError && (
          <Alert severity="error" onClose={clearDeleteError} sx={{ mb: 2 }}>
            {deleteError}
          </Alert>
        )}

        {projectError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {projectError}
          </Alert>
        )}

        {loadingProject && (
          <Card sx={{ p: 4, textAlign: 'center', mb: 3 }}>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Consultando proyecto...
            </Typography>
          </Card>
        )}

        {!loadingProject && project && (
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={1.5}
              mb={1.5}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h5" fontWeight={700}>
                  {project.name}
                </Typography>
                {isOwner && (
                  <Chip
                    label="Tuyo"
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setIsCreateTaskOpen(true)}
                  sx={{ textTransform: 'none' }}
                >
                  Nueva Tarea
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setIsDeleteOpen(true)}
                  sx={{ textTransform: 'none' }}
                >
                  Eliminar Proyecto
                </Button>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {project.description || 'Sin descripción.'}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 3 }}
              justifyContent="space-between"
            >
              <Typography variant="caption" color="text.secondary">
                ID Proyecto: <strong>#{project.id}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dueño: <strong>ID #{project.ownerId}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fecha de creación: <strong>{project.createdAt}</strong>
              </Typography>
            </Stack>
          </Paper>
        )}

        {!loadingProject && project && (
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Tareas de este proyecto
            </Typography>

            <TaskList
              tasks={tasks}
              projects={[project]}
              loading={loadingTasks}
              error={errorTasks}
              selectedProjectId={project.id}
              onClearProjectFilter={() => {}}
              onSelectTask={(taskId) => navigate(`/tasks/${taskId}`)}
              onTaskUpdated={() => refetchTasks()}
            />
          </Paper>
        )}
      </Container>

      {project && (
        <TaskFormDialog
          open={isCreateTaskOpen}
          projects={[project]}
          initialProjectId={project.id}
          onClose={() => setIsCreateTaskOpen(false)}
          onSuccess={() => refetchTasks()}
        />
      )}

      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-project-detail-title"
        aria-describedby="delete-project-detail-description"
      >
        <DialogTitle id="delete-project-detail-title" fontWeight={700}>
          ¿Eliminar proyecto?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-project-detail-description">
            ¿Estás seguro de que deseas eliminar permanentemente el proyecto{' '}
            <strong>"{project?.name}"</strong>?
            <br /><br />
            <strong>Aviso importante:</strong> Todas las tareas de este proyecto se eliminarán en cascada.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsDeleteOpen(false)}
            color="inherit"
            disabled={Boolean(deletingProjectId)}
            autoFocus
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={Boolean(deletingProjectId)}
            onClick={() => {
              if (project) removeProject(project.id)
            }}
          >
            {deletingProjectId ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
