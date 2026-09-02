import { useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Project, Task, TaskPriority, TaskStatus } from '../types'

interface TaskListProps {
  tasks: Task[]
  projects: Project[]
  loading: boolean
  error: string | null
  selectedProjectId: number | null
  onClearProjectFilter: () => void
  onSelectTask: (id: number) => void
}

function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case 'DONE':
      return <Chip label="Completada" color="success" size="small" />
    case 'IN_PROGRESS':
      return <Chip label="En progreso" color="warning" size="small" />
    case 'TODO':
    default:
      return <Chip label="Por hacer" color="default" size="small" />
  }
}

function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'HIGH':
      return <Chip label="Prioridad: Alta" color="error" size="small" variant="outlined" />
    case 'MED':
      return <Chip label="Prioridad: Media" color="warning" size="small" variant="outlined" />
    case 'LOW':
    default:
      return <Chip label="Prioridad: Baja" color="default" size="small" variant="outlined" />
  }
}

export function TaskList({
  tasks,
  projects,
  loading,
  error,
  selectedProjectId,
  onClearProjectFilter,
  onSelectTask,
}: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={1}>
          Cargando tareas (GET /tasks)...
        </Typography>
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesProject = selectedProjectId === null || task.projectId === selectedProjectId
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    return matchesProject && matchesStatus
  })

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={1.5}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Tareas ({filteredTasks.length}{filteredTasks.length !== tasks.length ? ` de ${tasks.length}` : ''})
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Estado:
          </Typography>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 140, fontSize: '0.875rem' }}
          >
            <MenuItem value="ALL">Todas</MenuItem>
            <MenuItem value="TODO">Por hacer</MenuItem>
            <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
            <MenuItem value="DONE">Completadas</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {selectedProject && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={onClearProjectFilter}>
              Ver todas
            </Button>
          }
        >
          Filtrando por proyecto: <strong>{selectedProject.name}</strong>
        </Alert>
      )}

      {filteredTasks.length === 0 ? (
        <Typography color="text.secondary" py={3} textAlign="center">
          No hay tareas que coincidan con los filtros aplicados.
        </Typography>
      ) : (
        <Stack direction="column" spacing={2} sx={{maxHeight: 560, overflowY: 'auto', pr: 0.5 }}>
          {filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId)
            const projectName = project ? project.name : `Proyecto #${task.projectId}`

            return (
              <Card
                key={task.id}
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  transition: 'all 0.2s ease-in-out',
                  borderLeft: '4px solid',
                  borderLeftColor:
                    task.status === 'DONE'
                      ? 'success.main'
                      : task.status === 'IN_PROGRESS'
                      ? 'warning.main'
                      : 'grey.400',
                  '&:hover': {
                    boxShadow: 3,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ pb: 1, pt: 2, px: 2.5 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    gap={1}
                    mb={1}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                      }}
                      onClick={() => onSelectTask(task.id)}
                    >
                      {task.title}
                    </Typography>

                    <Stack direction="row" spacing={0.75} flexShrink={0}>
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </Stack>
                  </Stack>

                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    <strong>{projectName}</strong> (ID Proyecto: {task.projectId})
                  </Typography>

                  {task.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions
                  sx={{
                    pt: 0,
                    px: 2.5,
                    pb: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {task.dueDate ? `Entrega: ${task.dueDate}` : 'Sin fecha límite'}
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => onSelectTask(task.id)}
                  >
                    Ver detalle
                  </Button>
                </CardActions>
              </Card>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
