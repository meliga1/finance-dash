import { Router } from 'express'
import * as db from '../db'
import {
  SESSION_COOKIE_NAME,
  createSession,
  destroySession,
  hashPassword,
  isLockedOut,
  recordFailedAttempt,
  resetAttempts,
  validateSession,
  verifyPassword,
} from '../auth'
import { parseCookieHeader } from '../cookies'

const router = Router()

function setSessionCookie(res: import('express').Response, token: string, expiresAt: Date): void {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
  })
}

router.get('/session', (req, res) => {
  const user = db.getUser()
  if (!user) {
    res.json({ authenticated: false, setupRequired: true })
    return
  }

  const cookies = parseCookieHeader(req.headers.cookie)
  const token = cookies[SESSION_COOKIE_NAME]
  const authenticated = Boolean(token && validateSession(token))

  res.json({ authenticated, setupRequired: false })
})

router.post('/setup', (req, res) => {
  if (db.getUser()) {
    res.status(409).json({ error: 'already_configured' })
    return
  }

  const { username, password } = req.body ?? {}
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    res.status(400).json({ error: 'invalid_input' })
    return
  }

  const { hash, salt } = hashPassword(password)
  db.createUser(username, hash, salt)

  const { token, expiresAt } = createSession()
  setSessionCookie(res, token, expiresAt)

  res.json({ ok: true })
})

router.post('/login', (req, res) => {
  const user = db.getUser()
  if (!user) {
    res.status(409).json({ error: 'setup_required' })
    return
  }

  const lockoutKey = req.ip ?? 'unknown'
  if (isLockedOut(lockoutKey)) {
    res.status(429).json({ error: 'locked_out' })
    return
  }

  const { username, password } = req.body ?? {}
  const valid =
    typeof username === 'string' &&
    typeof password === 'string' &&
    username === user.username &&
    verifyPassword(password, user.password_salt, user.password_hash)

  if (!valid) {
    recordFailedAttempt(lockoutKey)
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  resetAttempts(lockoutKey)
  const { token, expiresAt } = createSession()
  setSessionCookie(res, token, expiresAt)

  res.json({ ok: true })
})

router.post('/logout', (req, res) => {
  const cookies = parseCookieHeader(req.headers.cookie)
  const token = cookies[SESSION_COOKIE_NAME]
  if (token) destroySession(token)

  res.clearCookie(SESSION_COOKIE_NAME)
  res.json({ ok: true })
})

export default router
