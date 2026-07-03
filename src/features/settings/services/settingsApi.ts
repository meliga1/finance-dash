import { http } from '@/services/http'

export interface BybitSettingsStatus {
  configured: boolean
}

// GET /settings/bybit
export async function getBybitSettingsStatus(): Promise<BybitSettingsStatus> {
  return http<BybitSettingsStatus>('/settings/bybit')
}

// PUT /settings/bybit
export async function saveBybitSettings(apiKey: string, apiSecret: string): Promise<void> {
  await http('/settings/bybit', { method: 'PUT', body: { apiKey, apiSecret } })
}
