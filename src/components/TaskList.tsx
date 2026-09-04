import { useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
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
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus'
import type { Project, Task, TaskPriority, TaskStatus } from '../types'

interface TaskListProps {
  tasks: Task[]
  projects: Project[]
  loading: boolean
  error: string | null
  selectedProjectId: number | null
  onClearProjectFilter: () => void
  onSelectTask: (id: number) => void
  onTaskUpdated?: () => void
  maxHeight?: number | string
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
  onTaskUpdated,
  maxHeight,
}: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Hook para cambiar el estado de la tarea (PATCH /tasks/{id}/status)
  const {
    changeStatus,
    updatingTaskId,
    error: patchError,
    clearError,
  } = useUpdateTaskStatus({
    onSuccess: () => {
      onTaskUpdated?.()
    },
  })

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

  // Filtrar según el proyecto seleccionado y el estado seleccionado
  const filteredTasks = tasks.filter((task) => {
    const matchesProject = selectedProjectId === null || task.projectId === selectedProjectId
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    return matchesProject && matchesStatus
  })

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <Stack spacing={2}>
      {/* Alerta si falla el cambio de estado (ej: error 422 si DONE no tiene responsable) */}
      {patchError && (
        <Alert severity="error" onClose={clearError}>
          {patchError}
        </Alert>
      )}

      {/* Barra superior de control y filtros */}
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
            Filtrar:
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

      {/* Indicador de filtro por proyecto activo */}
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

      {/* Lista de tarjetas de tareas */}
      {filteredTasks.length === 0 ? (
        <Typography color="text.secondary" py={3} textAlign="center">
          No hay tareas que coincidan con los filtros aplicados.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            ...(maxHeight ? { maxHeight, overflowY: 'auto', pr: 0.5 } : {}),
          }}
        >
          {filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId)
            const projectName = project ? project.name : `Proyecto #${task.projectId}`
            const isUpdating = updatingTaskId === task.id

            return (
              <Card
                key={task.id}
                variant="outlined"
                sx={{
                  flexShrink: 0, // Evita que flexbox colapse la tarjeta
                  minHeight: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease-in-out',
                  borderLeft: '5px solid',
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
                  {/* Encabezado de la tarjeta: Título y Selector de Estado */}
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

                    {/* Selector interactivo de Estado (PATCH /tasks/{id}/status) y Prioridad */}
                    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                      <Select
                        size="small"
                        value={task.status}
                        disabled={isUpdating}
                        onChange={(e) => changeStatus(task.id, e.target.value as TaskStatus)}
                        sx={{
                          height: 30,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: 1.5,
                          bgcolor:
                            task.status === 'DONE'
                              ? 'rgba(46, 125, 50, 0.1)'
                              : task.status === 'IN_PROGRESS'
                              ? 'rgba(237, 108, 2, 0.1)'
                              : 'action.hover',
                          color:
                            task.status === 'DONE'
                              ? 'success.main'
                              : task.status === 'IN_PROGRESS'
                              ? 'warning.main'
                              : 'text.primary',
                          '& .MuiSelect-select': { py: 0.25, px: 1 },
                        }}
                      >
                        <MenuItem value="TODO">Por hacer</MenuItem>
                        <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                        <MenuItem value="DONE">Completada</MenuItem>
                      </Select>

                      {isUpdating && <CircularProgress size={16} />}
                      {getPriorityBadge(task.priority)}
                    </Stack>
                  </Stack>

                  {/* Proyecto asociado */}
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    <strong>{projectName}</strong> (ID Proyecto: {task.projectId})
                  </Typography>

                  {/* Descripción de la tarea si existe */}
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

                {/* Acciones de la tarjeta: fecha límite y botón para navegar al detalle */}
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
        </Box>
      )}
    </Stack>
  )
}
