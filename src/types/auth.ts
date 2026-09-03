export type UserRole = 'USER' | 'ADMIN'

export interface UserResponse {
  id: number
  username: string
  email: string
  role: UserRole
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

export const TOKEN_KEY = 'jwt-auth-demo-token'
