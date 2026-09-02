import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FolderIcon from '@mui/icons-material/Folder'
import PersonIcon from '@mui/icons-material/Person'
import TagIcon from '@mui/icons-material/Tag'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Task, TaskPriority, TaskStatus } from '../types'

interface TaskCardDetailProps {
  task: Task
  projectName: string
  projectDescription?: string
}

function getStatusChip(status: TaskStatus) {
  switch (status) {
    case 'DONE':
      return <Chip label="Completada" color="success" />
    case 'IN_PROGRESS':
      return <Chip label="En progreso" color="warning" />
    case 'TODO':
    default:
      return <Chip label="Por hacer" color="default" />
  }
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
}: TaskCardDetailProps) {
  return (
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
          <Stack direction="row" spacing={1}>
            {getStatusChip(task.status)}
            {getPriorityChip(task.priority)}
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
            <PersonIcon color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Responsable (assigneeId)
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {task.assigneeId ? `Usuario #${task.assigneeId}` : 'Sin asignar'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
