import AssignmentIcon from '@mui/icons-material/Assignment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const isDashboard = location.pathname === '/dashboard'
  const isTasks = location.pathname.startsWith('/tasks')

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 3, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DashboardIcon color="primary" />
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ cursor: 'pointer', color: 'text.primary' }}
              onClick={() => navigate('/dashboard')}
            >
              TaskFlow App
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant={isDashboard ? 'contained' : 'text'}
              size="small"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>

            <Button
              variant={isTasks ? 'contained' : 'text'}
              size="small"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/tasks')}
            >
              Tareas (/tasks)
            </Button>

            <Box sx={{ width: 8 }} />

            <Button
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
