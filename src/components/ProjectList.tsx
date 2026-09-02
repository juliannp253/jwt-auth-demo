import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Project, Task } from '../types'

interface ProjectListProps {
  projects: Project[]
  tasks?: Task[]
  loading: boolean
  error: string | null
  selectedProjectId?: number | null
  onSelectProject?: (id: number | null) => void
}

export function ProjectList({
  projects,
  tasks = [],
  loading,
  error,
  selectedProjectId = null,
  onSelectProject,
}: ProjectListProps) {
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
              </Stack>
            </ListItem>
          )
        })}
      </List>
    </Stack>
  )
}