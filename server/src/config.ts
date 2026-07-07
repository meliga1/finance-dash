import 'dotenv/config'
import { ensureEncryptionKey } from './secrets'

export const config = {
  bybitBaseUrl: process.env.BYBIT_BASE_URL ?? 'https://api.bybit.com',
  port: Number(process.env.PORT ?? 3333),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
  settingsEncryptionKey: ensureEncryptionKey(),
}
