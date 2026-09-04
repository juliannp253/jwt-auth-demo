import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          gap: 2,
        }}
      >
        <CircularProgress size={36} />
        <Typography variant="body2" color="text.secondary">
          Verificando sesión...
        </Typography>
      </Box>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}