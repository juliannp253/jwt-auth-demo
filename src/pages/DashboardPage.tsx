import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { DashboardMetrics } from '../components/DashboardMetrics'
import { Navbar } from '../components/Navbar'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { TaskFormDialog } from '../components/TaskFormDialog'
import { TaskList } from '../components/TaskList'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'
import { useProjectTasks } from '../hooks/useProjectTasks'
import { useTasks } from '../hooks/useTasks'

export function DashboardPage() {
  const navigate = useNavigate()

  const {
    projects,
    loading: loadingProjects,
    error: errorProjects,
    refetch: refetchProjects,
  } = useProjects()

  const {
    tasks,
    loading: loadingTasks,
    error: errorTasks,
    refetch: refetchTasks,
  } = useTasks()

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const {
    tasks: projectTasks,
    loading: loadingProjectTasks,
    error: errorProjectTasks,
    refetch: refetchProjectTasks,
  } = useProjectTasks(selectedProjectId)

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  const projectForm = useProjectForm({
    onSuccess: () => {
      refetchProjects()
    },
  })

  function handleRefreshAll() {
    refetchProjects()
    refetchTasks()
    if (selectedProjectId) {
      refetchProjectTasks()
    }
  }

  const displayTasks = selectedProjectId ? projectTasks : tasks
  const displayLoading = selectedProjectId ? loadingProjectTasks : loadingTasks
  const displayError = selectedProjectId ? errorProjectTasks : errorTasks

  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const completedCount = tasks.filter((t) => t.status === 'DONE').length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Tablero de Proyectos y Tareas
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateTaskOpen(true)}
            >
              Nueva Tarea
            </Button>
          </Stack>
        </Stack>

        <DashboardMetrics
          projectsCount={projects.length}
          tasksCount={tasks.length}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
        />

        <Grid container spacing={3}>
          {/* Columna Izquierda: Proyectos */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Paper elevation={1} sx={{ p: 2.5 }}>
                <ProjectForm {...projectForm} />
              </Paper>

              <Paper elevation={1} sx={{ p: 2.5 }}>
                <ProjectList
                  projects={projects}
                  tasks={tasks}
                  loading={loadingProjects}
                  error={errorProjects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onProjectDeleted={(deletedId) => {
                    if (selectedProjectId === deletedId) {
                      setSelectedProjectId(null)
                    }
                    refetchProjects()
                    refetchTasks()
                  }}
                />
              </Paper>
            </Stack>
          </Grid>

          {/* Columna Derecha: Tareas */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={1} sx={{ p: 2.5 }}>
              <TaskList
                tasks={displayTasks}
                projects={projects}
                loading={displayLoading}
                error={displayError}
                selectedProjectId={selectedProjectId}
                onClearProjectFilter={() => setSelectedProjectId(null)}
                onSelectTask={(id) => navigate(`/tasks/${id}`)}
                onTaskUpdated={() => {
                  refetchTasks()
                  if (selectedProjectId) refetchProjectTasks()
                }}
                maxHeight={560}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <TaskFormDialog
        open={isCreateTaskOpen}
        projects={projects}
        initialProjectId={selectedProjectId}
        onClose={() => setIsCreateTaskOpen(false)}
        onSuccess={() => {
          refetchTasks()
          refetchProjects()
          if (selectedProjectId) refetchProjectTasks()
        }}
      />
    </Box>
  )
}