import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, '..', 'data')
const DB_PATH = path.join(DATA_DIR, 'app.db')

fs.mkdirSync(DATA_DIR, { recursive: true })

const db = new DatabaseSync(DB_PATH)

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      bybit_api_key_enc TEXT NOT NULL,
      bybit_api_secret_enc TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
  `)
}

export interface UserRow {
  id: number
  username: string
  password_hash: string
  password_salt: string
  created_at: string
}

export function getUser(): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = 1').get() as UserRow | undefined
}

export function createUser(username: string, passwordHash: string, passwordSalt: string): void {
  db.prepare(
    'INSERT INTO users (id, username, password_hash, password_salt, created_at) VALUES (1, ?, ?, ?, ?)',
  ).run(username, passwordHash, passwordSalt, new Date().toISOString())
}

export function updateUserPassword(passwordHash: string, passwordSalt: string): void {
  db.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = 1').run(
    passwordHash,
    passwordSalt,
  )
}

export interface SessionRow {
  token_hash: string
  created_at: string
  expires_at: string
}

export function createSession(tokenHash: string, expiresAt: Date): void {
  db.prepare('INSERT INTO sessions (token_hash, created_at, expires_at) VALUES (?, ?, ?)').run(
    tokenHash,
    new Date().toISOString(),
    expiresAt.toISOString(),
  )
}

export function getSession(tokenHash: string): SessionRow | undefined {
  return db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(tokenHash) as
    | SessionRow
    | undefined
}

export function deleteSession(tokenHash: string): void {
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash)
}

export function deleteExpiredSessions(): void {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(new Date().toISOString())
}

export interface SettingsRow {
  id: number
  bybit_api_key_enc: string
  bybit_api_secret_enc: string
  updated_at: string
}

export function getSettings(): SettingsRow | undefined {
  return db.prepare('SELECT * FROM settings WHERE id = 1').get() as SettingsRow | undefined
}

export function upsertSettings(apiKeyEnc: string, apiSecretEnc: string): void {
  db.prepare(
    `INSERT INTO settings (id, bybit_api_key_enc, bybit_api_secret_enc, updated_at)
     VALUES (1, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       bybit_api_key_enc = excluded.bybit_api_key_enc,
       bybit_api_secret_enc = excluded.bybit_api_secret_enc,
       updated_at = excluded.updated_at`,
  ).run(apiKeyEnc, apiSecretEnc, new Date().toISOString())
}
