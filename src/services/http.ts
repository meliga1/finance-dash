const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

/** Envelope de erro padronizado do contrato (ver API_CONTRACT.md). */
export type ApiErrorEnvelope = {
  error: {
    code: string
    message: string
  }
}

export const NETWORK_ERROR_CODE = 'NETWORK_ERROR'

/** Erro único lançado por toda falha HTTP — carrega status + code do contrato. */
export class HttpError extends Error {
  readonly status: number
  readonly code: string

  constructor(params: { status: number; code: string; message: string; cause?: unknown }) {
    super(params.message, { cause: params.cause })
    this.name = 'HttpError'
    this.status = params.status
    this.code = params.code
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

function fallbackCode(status: number): string {
  switch (status) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHENTICATED'
    case 404:
      return 'NOT_FOUND'
    case 500:
      return 'INTERNAL_ERROR'
    default:
      return 'HTTP_ERROR'
  }
}

function isErrorEnvelope(data: unknown): data is ApiErrorEnvelope {
  if (typeof data !== 'object' || data === null) return false
  const envelope = data as Record<string, unknown>
  const error = envelope.error
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as Record<string, unknown>).code === 'string' &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

async function normalizeError(response: Response): Promise<{ code: string; message: string }> {
  try {
    const data: unknown = await response.json()
    if (isErrorEnvelope(data)) return data.error
  } catch {
    // corpo vazio ou não-JSON — cai no fallback por status
  }
  return {
    code: fallbackCode(response.status),
    message: `A requisição falhou (HTTP ${response.status}).`,
  }
}

/**
 * Cliente HTTP tipado, único ponto de contato com o back-end.
 * Todos os services usam este helper: `http<Tipo>(path, options)`.
 */
export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    // Falha de rede (offline, DNS, CORS bloqueado, servidor fora do ar).
    throw new HttpError({
      status: 0,
      code: NETWORK_ERROR_CODE,
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      cause,
    })
  }

  if (!response.ok) {
    const { code, message } = await normalizeError(response)
    throw new HttpError({ status: response.status, code, message })
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
