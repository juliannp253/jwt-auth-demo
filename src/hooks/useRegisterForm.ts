import { useState } from 'react'
import * as authService from '../services/authService'
import { getApiErrorMessage } from '../services/httpClient'
import type { UserResponse } from '../types'

interface UseRegisterFormOptions {
  onSuccess?: (user: UserResponse) => void
}

export function useRegisterForm({ onSuccess }: UseRegisterFormOptions = {}) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validaciones mínimas según Swagger (username >= 3, email con @, password >= 6)
  const isValid =
    username.trim().length >= 3 &&
    email.trim().includes('@') &&
    password.length >= 6

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || loading) return

    setLoading(true)
    setError(null)

    try {
      const user = await authService.register({
        username: username.trim(),
        email: email.trim(),
        password,
      })
      onSuccess?.(user)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return {
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
  }
}
