import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { API_URL } from '../types'

export function RegisterPage() {
  const navigate = useNavigate()

  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    isValid,
    handleSubmit,
  } = useRegisterForm({
    onSuccess: (user) => {
      navigate('/login', {
        state: {
          message: `¡Usuario "${user.username}" registrado con éxito! Ya puedes iniciar sesión.`,
        },
      })
    },
  })

  return (
    <Box maxWidth={480} mx="auto" mt={8} px={2}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Crear Cuenta
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Completa el formulario para registrarte en la plataforma.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <Alert severity="info" variant="outlined">
              API: <strong>{API_URL}</strong>
            </Alert>

            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              helperText="Mínimo 3 caracteres"
              autoComplete="username"
            />

            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              helperText="Ejemplo: usuario@correo.com"
              autoComplete="email"
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              helperText="Mínimo 6 caracteres"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || loading}
              size="large"
            >
              {loading ? 'Registrando…' : 'Registrarse'}
            </Button>

            <Typography variant="body2" textAlign="center" pt={1}>
              ¿Ya tienes una cuenta?{' '}
              <Link component={RouterLink} to="/login" fontWeight={600}>
                Inicia sesión aquí
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
