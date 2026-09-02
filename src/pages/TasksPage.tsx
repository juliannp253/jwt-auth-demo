import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { Navbar } from '../components/Navbar'
import { TaskList } from '../components/TaskList'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'

export function TasksPage() {
  const navigate = useNavigate()
  const { tasks, loading, error, refetch } = useTasks()
  const { projects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      <Navbar />

      <Container maxWidth="md">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
              <Button
                startIcon={<ArrowBackIcon />}
                size="small"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Typography variant="caption" color="text.secondary">
                Ruta: <code>/tasks</code> (GET /tasks)
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight={700}>
              Listado de Tareas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explora y filtra todas las tareas registradas en el backend
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Actualizar
          </Button>
        </Stack>

        {/* Contenedor principal de la lista de tareas */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TaskList
            tasks={tasks}
            projects={projects}
            loading={loading}
            error={error}
            selectedProjectId={selectedProjectId}
            onClearProjectFilter={() => setSelectedProjectId(null)}
            onSelectTask={(id) => navigate(`/tasks/${id}`)}
          />
        </Paper>
      </Container>
    </Box>
  )
}
