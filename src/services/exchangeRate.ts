const EXCHANGE_RATE_API_URL = 'https://api.frankfurter.dev/v1'

// GET https://api.frankfurter.dev/v1/latest?from=USD&to=BRL
export async function fetchUsdToBrlRate(): Promise<number> {
  const response = await fetch(`${EXCHANGE_RATE_API_URL}/latest?from=USD&to=BRL`)

  if (!response.ok) {
    throw new Error(`Exchange rate request failed: ${response.status}`)
  }

  const data = (await response.json()) as { rates: { BRL: number } }
  return data.rates.BRL
}
