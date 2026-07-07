import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const ENV_PATH = path.resolve(__dirname, '..', '.env')
const ENV_VAR_NAME = 'SETTINGS_ENCRYPTION_KEY'

// Chave usada para criptografar as credenciais da Bybit em repouso (SQLite).
// Gerada automaticamente no primeiro boot e persistida em server/.env (já
// no .gitignore) — nunca deve ser digitada manualmente.
export function ensureEncryptionKey(): Buffer {
  const existing = process.env[ENV_VAR_NAME]
  if (existing) {
    return Buffer.from(existing, 'hex')
  }

  const key = crypto.randomBytes(32)
  const hexKey = key.toString('hex')

  const separator = fs.existsSync(ENV_PATH) ? '\n' : ''
  fs.appendFileSync(ENV_PATH, `${separator}${ENV_VAR_NAME}=${hexKey}\n`)
  process.env[ENV_VAR_NAME] = hexKey

  console.log(`Generated ${ENV_VAR_NAME} and saved it to server/.env`)

  return key
}
