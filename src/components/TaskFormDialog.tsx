import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useAuth } from '../hooks/useAuth'
import { useTaskForm } from '../hooks/useTaskForm'
import type { Project, Task, TaskPriority } from '../types'

interface TaskFormDialogProps {
  open: boolean
  projects: Project[]
  initialProjectId?: number | null
  onClose: () => void
  onSuccess: (newTask: Task) => void
}

export function TaskFormDialog({
  open,
  projects,
  initialProjectId,
  onClose,
  onSuccess,
}: TaskFormDialogProps) {
  const { user } = useAuth()

  // Lista de usuarios disponibles para asignar (incluyendo al usuario logueado)
  const availableUsers = [
    ...(user ? [{ id: user.id, label: `👤 ${user.username} (ID: ${user.id} - Tú)` }] : []),
    { id: 1, label: 'Ana (ID: 1)' },
    { id: 2, label: 'Luis (ID: 2)' },
    { id: 3, label: 'Admin (ID: 3)' },
  ].filter((u, index, self) => self.findIndex((item) => item.id === u.id) === index)

  const form = useTaskForm({
    initialProjectId,
    initialAssigneeId: user?.id ?? 1, // Por defecto asignado al usuario actual
    onSuccess: (task) => {
      onSuccess(task)
      onClose()
    },
  })

  function handleCancel() {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <form onSubmit={form.handleSubmit}>
        <DialogTitle fontWeight={700}>Crear Nueva Tarea</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} pt={0.5}>
            {form.error && <Alert severity="error">{form.error}</Alert>}

            {/* Selector de Proyecto obligatorio */}
            <TextField
              select
              label="Proyecto *"
              value={form.projectId}
              onChange={(e) => form.setProjectId(Number(e.target.value))}
              required
              fullWidth
              helperText="Selecciona el proyecto al que pertenecerá esta tarea"
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  📁 {p.name} (ID: {p.id})
                </MenuItem>
              ))}
            </TextField>

            {/* Título de la tarea */}
            <TextField
              label="Título de la tarea *"
              value={form.title}
              onChange={(e) => form.setTitle(e.target.value)}
              required
              fullWidth
              helperText="Mínimo 3 caracteres"
            />

            {/* Selector de Responsable obligatorio */}
            <TextField
              select
              label="Responsable / Asignado a *"
              value={form.assigneeId}
              onChange={(e) => form.setAssigneeId(Number(e.target.value))}
              required
              fullWidth
              helperText="Selecciona el usuario que se encargará de la tarea (obligatorio)"
            >
              {availableUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Selector de Prioridad */}
            <TextField
              select
              label="Prioridad *"
              value={form.priority}
              onChange={(e) => form.setPriority(e.target.value as TaskPriority)}
              required
              fullWidth
            >
              <MenuItem value="LOW">Baja</MenuItem>
              <MenuItem value="MED">Media</MenuItem>
              <MenuItem value="HIGH">Alta</MenuItem>
            </TextField>

            {/* Descripción opcional */}
            <TextField
              label="Descripción"
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Detalles de la tarea..."
            />

            {/* Fecha límite opcional */}
            <TextField
              label="Fecha límite (dueDate)"
              type="date"
              value={form.dueDate}
              onChange={(e) => form.setDueDate(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancel} color="inherit" disabled={form.submitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!form.isValid || form.submitting}
          >
            {form.submitting ? 'Creando…' : 'Crear Tarea'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
