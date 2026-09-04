import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useDeleteProject } from '../hooks/useDeleteProject'
import type { Project, Task } from '../types'

interface ProjectListProps {
  projects: Project[]
  tasks?: Task[]
  loading: boolean
  error: string | null
  selectedProjectId?: number | null
  onSelectProject?: (id: number | null) => void
  onProjectDeleted?: (projectId: number) => void
}

export function ProjectList({
  projects,
  tasks = [],
  loading,
  error,
  selectedProjectId = null,
  onSelectProject,
  onProjectDeleted,
}: ProjectListProps) {
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const {
    removeProject,
    deletingProjectId,
    error: deleteError,
    clearError,
  } = useDeleteProject({
    onSuccess: (id) => {
      setProjectToDelete(null)
      onProjectDeleted?.(id)
    },
  })

  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (projects.length === 0) {
    return <Typography color="text.secondary">No hay proyectos.</Typography>
  }

  return (
    <Stack spacing={1}>
      {deleteError && (
        <Alert severity="error" onClose={clearError}>
          {deleteError}
        </Alert>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          Proyectos ({projects.length})
        </Typography>

        {selectedProjectId !== null && onSelectProject && (
          <Button size="small" onClick={() => onSelectProject(null)}>
            Ver todos
          </Button>
        )}
      </Stack>

      <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto', pr: 0.5 }}>
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id
          const taskCount = tasks.filter((t) => t.projectId === project.id).length
          const isDeleting = deletingProjectId === project.id

          return (
            <ListItem
              key={project.id}
              divider
              sx={{
                borderRadius: 1,
                mb: 0.5,
                bgcolor: isSelected ? 'action.selected' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={isSelected ? 700 : 500}>
                    {project.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {project.description || `ID: ${project.id}`}
                  </Typography>
                }
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${taskCount} ${taskCount === 1 ? 'tarea' : 'tareas'}`}
                  size="small"
                  variant={taskCount > 0 ? 'filled' : 'outlined'}
                  color={taskCount > 0 ? 'primary' : 'default'}
                />

                {onSelectProject && (
                  <Button
                    size="small"
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => onSelectProject(isSelected ? null : project.id)}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, px: 1 }}
                  >
                    {isSelected ? 'Activo' : 'Filtrar'}
                  </Button>
                )}

                <Button
                  size="small"
                  color="error"
                  variant="text"
                  disabled={isDeleting}
                  onClick={() => setProjectToDelete(project)}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, px: 1 }}
                >
                  {isDeleting ? 'Borrando…' : 'Eliminar'}
                </Button>
              </Stack>
            </ListItem>
          )
        })}
      </List>

      <Dialog
        open={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight={700}>¿Eliminar proyecto?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el proyecto{' '}
            <strong>"{projectToDelete?.name}"</strong>?
            <br /><br />
            <strong>Aviso importante:</strong> Todas las tareas asociadas a este proyecto también se eliminarán permanentemente en cascada.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setProjectToDelete(null)}
            color="inherit"
            disabled={Boolean(deletingProjectId)}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={Boolean(deletingProjectId)}
            onClick={() => {
              if (projectToDelete) removeProject(projectToDelete.id)
            }}
          >
            {deletingProjectId ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}