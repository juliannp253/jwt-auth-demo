import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface DashboardMetricsProps {
  projectsCount: number
  tasksCount: number
  inProgressCount: number
  completedCount: number
}

export function DashboardMetrics({
  projectsCount,
  tasksCount,
  inProgressCount,
  completedCount,
}: DashboardMetricsProps) {
  return (
    <Grid container spacing={2} mb={3}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <FolderOutlinedIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Proyectos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {projectsCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <AssignmentOutlinedIcon color="info" fontSize="large" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tareas Totales
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {tasksCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <PendingActionsIcon color="warning" fontSize="large" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  En Progreso
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {inProgressCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CheckCircleOutlineIcon color="success" fontSize="large" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Completadas
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {completedCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
