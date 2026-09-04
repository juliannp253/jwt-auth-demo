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


  const availableUsers = [
    ...(user ? [{ id: user.id, label: `${user.username} (ID: ${user.id} - Tu usuario)` }] : []),
    { id: 1, label: 'Ana (ID: 1 - Demo)' },
    { id: 2, label: 'Luis (ID: 2 - Demo)' },
    { id: 3, label: 'Admin (ID: 3 - Demo)' },
  ].filter((u, index, self) => self.findIndex((item) => item.id === u.id) === index)

  const form = useTaskForm({
    initialProjectId,
    initialAssigneeId: user?.id ?? 1,
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
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      aria-labelledby="task-form-dialog-title"
    >
      <form onSubmit={form.handleSubmit}>
        <DialogTitle id="task-form-dialog-title" fontWeight={700}>
          Crear Nueva Tarea
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} pt={0.5}>
            {form.error && <Alert severity="error">{form.error}</Alert>}

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
                  {p.name} (ID: {p.id})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Título de la tarea *"
              value={form.title}
              onChange={(e) => form.setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
              helperText="Mínimo 3 caracteres"
            />

            <TextField
              select
              label="Responsable / Asignado a *"
              value={form.assigneeId}
              onChange={(e) => form.setAssigneeId(Number(e.target.value))}
              required
              fullWidth
              helperText="Usuarios registrados en la API demo (La API no cuenta con GET /users)."
            >
              {availableUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.label}
                </MenuItem>
              ))}
            </TextField>

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

            <TextField
              label="Descripción"
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Detalles de la tarea..."
            />

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
