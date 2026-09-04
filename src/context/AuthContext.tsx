import { createContext, useEffect, useState, type ReactNode } from 'react'
import * as authService from '../services/authService'
import { getApiErrorMessage } from '../services/httpClient'
import type { UserResponse } from '../types'

interface LoginResult {
  success: boolean
  error?: string
}

export interface AuthContextValue {
  isAuthenticated: boolean
  user: UserResponse | null
  loading: boolean
  login: (username: string, password: string) => Promise<LoginResult>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getToken()))
  const [user, setUser] = useState<UserResponse | null>(null)

  const [loading, setLoading] = useState(() => Boolean(authService.getToken()))

  useEffect(() => {
    const token = authService.getToken()
    if (!token) {
      setLoading(false)
      setIsAuthenticated(false)
      setUser(null)
      return
    }

    let cancelled = false

    authService
      .getMe()
      .then((userData) => {
        if (!cancelled) {
          setUser(userData)
          setIsAuthenticated(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          authService.clearToken()
          setIsAuthenticated(false)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      authService.clearToken()
      setIsAuthenticated(false)
      setUser(null)
      setLoading(false)
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  async function handleLogin(username: string, password: string): Promise<LoginResult> {
    setLoading(true)
    try {
      const token = await authService.login(username, password)
      authService.saveToken(token)
      setIsAuthenticated(true)

      const userData = await authService.getMe()
      setUser(userData)

      return { success: true }
    } catch (err) {
      return { success: false, error: getApiErrorMessage(err) }
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    authService.clearToken()
    setIsAuthenticated(false)
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}