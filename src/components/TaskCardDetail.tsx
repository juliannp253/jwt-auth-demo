import { useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EditIcon from '@mui/icons-material/Edit'
import FolderIcon from '@mui/icons-material/Folder'
import PersonIcon from '@mui/icons-material/Person'
import TagIcon from '@mui/icons-material/Tag'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { TaskEditDialog } from './TaskEditDialog'
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus'
import type { Task, TaskPriority, TaskStatus } from '../types'

interface TaskCardDetailProps {
  task: Task
  projectName: string
  projectDescription?: string
  onStatusUpdated?: (updatedTask: Task) => void
}

function getPriorityChip(priority: TaskPriority) {
  switch (priority) {
    case 'HIGH':
      return <Chip label="Prioridad: Alta" color="error" variant="outlined" />
    case 'MED':
      return <Chip label="Prioridad: Media" color="warning" variant="outlined" />
    case 'LOW':
    default:
      return <Chip label="Prioridad: Baja" color="default" variant="outlined" />
  }
}

export function TaskCardDetail({
  task,
  projectName,
  projectDescription,
  onStatusUpdated,
}: TaskCardDetailProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { changeStatus, updatingTaskId, error, clearError } = useUpdateTaskStatus({
    onSuccess: (updated) => {
      onStatusUpdated?.(updated)
    },
  })

  const isUpdating = updatingTaskId === task.id

  return (
    <Stack spacing={2}>
      {error && (
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      )}

      {!task.assigneeId && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={() => setIsEditOpen(true)}>
              Asignar ahora
            </Button>
          }
        >
          Esta tarea no tiene responsable asignado (es obligatorio para poder marcarla como completada).
        </Alert>
      )}

      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
            mb={2}
          >
            <Typography variant="h5" fontWeight={700}>
              {task.title}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Select
                size="small"
                value={task.status}
                disabled={isUpdating}
                onChange={(e) => changeStatus(task.id, e.target.value as TaskStatus)}
                sx={{
                  fontWeight: 600,
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
                }}
              >
                <MenuItem value="TODO">Por hacer</MenuItem>
                <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                <MenuItem value="DONE">Completada</MenuItem>
              </Select>

              {isUpdating && <CircularProgress size={20} />}
              {getPriorityChip(task.priority)}

              <Button
                size="small"
                variant="outlined"         
                onClick={() => setIsEditOpen(true)}
              >
                Editar
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              PROYECTO ASOCIADO
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <FolderIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {projectName}
              </Typography>
              <Chip label={`ID: ${task.projectId}`} size="small" variant="outlined" />
            </Stack>
            {projectDescription && (
              <Typography variant="body2" color="text.secondary" mt={0.5} pl={4}>
                {projectDescription}
              </Typography>
            )}
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              DESCRIPCIÓN DE LA TAREA
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {task.description || 'Esta tarea no tiene una descripción detallada.'}
              </Typography>
            </Paper>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="space-around"
            sx={{ pt: 1 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TagIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  ID Tarea
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {task.id}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Fecha límite (dueDate)
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {task.dueDate || 'Sin fecha asignada'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon color={task.assigneeId ? 'primary' : 'warning'} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Responsable (assigneeId)
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={task.assigneeId ? 'text.primary' : 'warning.main'}
                >
                  {task.assigneeId ? `Usuario #${task.assigneeId}` : 'Sin asignar (¡Asigna uno!)'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <TaskEditDialog
        open={isEditOpen}
        task={task}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => {
          onStatusUpdated?.(updated)
        }}
      />
    </Stack>
  )
}
