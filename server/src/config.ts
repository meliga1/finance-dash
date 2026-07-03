import 'dotenv/config'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name} — copy server/.env.example to server/.env and fill in your Bybit ` +
        'read-only API credentials before starting the server.',
    )
  }
  return value
}

export const config = {
  bybitApiKey: requireEnv('BYBIT_API_KEY'),
  bybitApiSecret: requireEnv('BYBIT_API_SECRET'),
  bybitBaseUrl: process.env.BYBIT_BASE_URL ?? 'https://api.bybit.com',
  port: Number(process.env.PORT ?? 3333),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}
