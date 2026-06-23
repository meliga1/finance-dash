const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new HttpError(response.status, `Request failed: ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
