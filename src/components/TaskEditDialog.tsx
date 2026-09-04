import { useEffect, useState } from 'react'
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
import { getApiErrorMessage } from '../services/httpClient'
import { updateTask } from '../services/taskService'
import type { Task, TaskPriority } from '../types'

interface TaskEditDialogProps {
  open: boolean
  task: Task
  onClose: () => void
  onSuccess: (updatedTask: Task) => void
}

export function TaskEditDialog({
  open,
  task,
  onClose,
  onSuccess,
}: TaskEditDialogProps) {
  const { user } = useAuth()

  // Lista de usuarios disponibles para asignar
  const availableUsers = [
    ...(user ? [{ id: user.id, label: `👤 ${user.username} (ID: ${user.id} - Tú)` }] : []),
    { id: 1, label: 'Ana (ID: 1)' },
    { id: 2, label: 'Luis (ID: 2)' },
    { id: 3, label: 'Admin (ID: 3)' },
  ].filter((u, index, self) => self.findIndex((item) => item.id === u.id) === index)

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [assigneeId, setAssigneeId] = useState<number | ''>(task.assigneeId ?? (user?.id ?? 1))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sincronizar datos cuando cambia la tarea
  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || '')
    setPriority(task.priority)
    setDueDate(task.dueDate || '')
    setAssigneeId(task.assigneeId ?? (user?.id ?? 1))
    setError(null)
  }, [task, user])

  const isValid = title.trim().length >= 3 && Boolean(assigneeId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const updated = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || null,
        assigneeId: Number(assigneeId),
      })
      onSuccess(updated)
      onClose()
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle fontWeight={700}>Editar Tarea y Asignar Responsable</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} pt={0.5}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* Título de la tarea */}
            <TextField
              label="Título de la tarea *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              helperText="Mínimo 3 caracteres"
            />

            {/* Selector de Responsable (obligatorio) */}
            <TextField
              select
              label="Responsable / Asignado a *"
              value={assigneeId}
              onChange={(e) => setAssigneeId(Number(e.target.value))}
              required
              fullWidth
              helperText="Selecciona a quién asignar esta tarea (obligatorio)"
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
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              required
              fullWidth
            >
              <MenuItem value="LOW">Baja</MenuItem>
              <MenuItem value="MED">Media</MenuItem>
              <MenuItem value="HIGH">Alta</MenuItem>
            </TextField>

            {/* Descripción */}
            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            {/* Fecha límite */}
            <TextField
              label="Fecha límite (dueDate)"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || submitting}
          >
            {submitting ? 'Guardando…' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
