import * as db from './db'
import { config } from './config'
import { encrypt, decrypt } from './crypto'

export interface BybitCredentials {
  apiKey: string
  apiSecret: string
}

export function getBybitCredentials(): BybitCredentials | null {
  const row = db.getSettings()
  if (!row) return null

  return {
    apiKey: decrypt(row.bybit_api_key_enc, config.settingsEncryptionKey),
    apiSecret: decrypt(row.bybit_api_secret_enc, config.settingsEncryptionKey),
  }
}

export function saveBybitCredentials(apiKey: string, apiSecret: string): void {
  db.upsertSettings(
    encrypt(apiKey, config.settingsEncryptionKey),
    encrypt(apiSecret, config.settingsEncryptionKey),
  )
}

export function isBybitConfigured(): boolean {
  return db.getSettings() !== undefined
}
