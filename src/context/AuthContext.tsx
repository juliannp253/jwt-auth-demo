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
  login: (username: string, password: string) => Promise<LoginResult>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getToken()))
  const [user, setUser] = useState<UserResponse | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    let cancelled = false

    authService
      .getMe()
      .then((userData) => {
        if (!cancelled) setUser(userData)
      })
      .catch(() => {
        if (!cancelled) {
          authService.clearToken()
          setIsAuthenticated(false)
          setUser(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  async function handleLogin(username: string, password: string): Promise<LoginResult> {
    try {
      const token = await authService.login(username, password)
      authService.saveToken(token)
      setIsAuthenticated(true)

      const userData = await authService.getMe()
      setUser(userData)

      return { success: true }
    } catch (err) {
      return { success: false, error: getApiErrorMessage(err) }
    }
  }

  function handleLogout() {
    authService.clearToken()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}