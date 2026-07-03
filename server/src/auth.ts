import crypto from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'
import * as db from './db'
import { parseCookieHeader } from './cookies'

export const SESSION_COOKIE_NAME = 'session'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 dias
const SCRYPT_KEY_LENGTH = 64

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex')
  return { hash, salt }
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const candidate = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH)
  const expected = Buffer.from(expectedHash, 'hex')

  if (candidate.length !== expected.length) return false
  return crypto.timingSafeEqual(candidate, expected)
}

export function createSession(): { token: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  db.createSession(sha256(token), expiresAt)

  return { token, expiresAt }
}

export function validateSession(token: string): boolean {
  const session = db.getSession(sha256(token))
  if (!session) return false

  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.deleteSession(session.token_hash)
    return false
  }

  return true
}

export function destroySession(token: string): void {
  db.deleteSession(sha256(token))
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const cookies = parseCookieHeader(req.headers.cookie)
  const token = cookies[SESSION_COOKIE_NAME]

  if (!token || !validateSession(token)) {
    res.status(401).json({ error: 'unauthenticated' })
    return
  }

  next()
}

// Bloqueio simples de força bruta em memória — processo único, usuário
// único, mesmo espírito do cache.ts.
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 60_000

interface AttemptRecord {
  count: number
  lockedUntil: number | null
}

const attempts = new Map<string, AttemptRecord>()

export function isLockedOut(key: string): boolean {
  const record = attempts.get(key)
  if (!record?.lockedUntil) return false

  if (record.lockedUntil > Date.now()) return true

  attempts.delete(key)
  return false
}

export function recordFailedAttempt(key: string): void {
  const record = attempts.get(key) ?? { count: 0, lockedUntil: null }
  record.count += 1

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS
  }

  attempts.set(key, record)
}

export function resetAttempts(key: string): void {
  attempts.delete(key)
}
