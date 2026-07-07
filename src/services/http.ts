const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class HttpError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

export function isErrorCode(error: unknown, code: string): boolean {
  return error instanceof HttpError && error.code === code
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const code = await response
      .clone()
      .json()
      .then((data: unknown) =>
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : undefined,
      )
      .catch(() => undefined)

    throw new HttpError(response.status, `Request failed: ${response.statusText}`, code)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
