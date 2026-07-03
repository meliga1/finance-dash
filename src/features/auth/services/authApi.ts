import { http } from '@/services/http'

export interface SessionStatus {
  authenticated: boolean
  setupRequired: boolean
}

// GET /auth/session
export async function getSessionStatus(): Promise<SessionStatus> {
  return http<SessionStatus>('/auth/session')
}

// POST /auth/setup
export async function setup(username: string, password: string): Promise<void> {
  await http('/auth/setup', { method: 'POST', body: { username, password } })
}

// POST /auth/login
export async function login(username: string, password: string): Promise<void> {
  await http('/auth/login', { method: 'POST', body: { username, password } })
}

// POST /auth/logout
export async function logout(): Promise<void> {
  await http('/auth/logout', { method: 'POST' })
}
