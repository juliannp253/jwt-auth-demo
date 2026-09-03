import axios from 'axios'
import { getApiBaseUrl } from '../config/apiUrl'
import type { RegisterRequest, UserResponse } from '../types'
import { TOKEN_KEY } from '../types'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Autentica al usuario y devuelve el token JWT (POST /auth/login)
 */
export async function login(username: string, password: string): Promise<string> {
  const { data } = await axios.post<{ token: string }>(
    `${getApiBaseUrl()}/auth/login`,
    { username: username.trim(), password },
  )
  return data.token
}

/**
 * Registra un nuevo usuario en la plataforma (POST /auth/register)
 */
export async function register(body: RegisterRequest): Promise<UserResponse> {
  const { data } = await axios.post<UserResponse>(
    `${getApiBaseUrl()}/auth/register`,
    {
      username: body.username.trim(),
      email: body.email.trim(),
      password: body.password,
    },
  )
  return data
}