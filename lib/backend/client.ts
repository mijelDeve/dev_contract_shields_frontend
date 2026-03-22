import "server-only"

import type { BackendLoginResponse } from "@/lib/backend/types"

const BACKEND_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"

const HARDCODED_AUTH = {
  email: "mijel2@example.com",
  password: "password123",
} as const

interface CachedToken {
  readonly value: string
  readonly expiresAtMs: number
}

class BackendRequestError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "BackendRequestError"
    this.statusCode = statusCode
  }
}

let cachedToken: CachedToken | null = null

function hasValidToken(token: CachedToken | null): token is CachedToken {
  if (!token) {
    return false
  }

  return Date.now() < token.expiresAtMs - 30_000
}

async function loginAndGetToken(): Promise<string> {
  const response = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(HARDCODED_AUTH),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new BackendRequestError("No se pudo autenticar contra el backend.", response.status)
  }

  const payload = (await response.json()) as BackendLoginResponse
  const expiresInMs = payload.expiresIn * 1000

  cachedToken = {
    value: payload.accessToken,
    expiresAtMs: Date.now() + expiresInMs,
  }

  return payload.accessToken
}

async function getAccessToken(): Promise<string> {
  if (hasValidToken(cachedToken)) {
    return cachedToken.value
  }

  return loginAndGetToken()
}

async function parseBackendError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(payload.message)) {
      return payload.message.join(". ")
    }

    if (typeof payload.message === "string" && payload.message.length > 0) {
      return payload.message
    }

    return `Error ${response.status}`
  } catch {
    return `Error ${response.status}`
  }
}

async function performAuthenticatedRequest(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken()

  return fetch(`${BACKEND_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    cache: "no-store",
  })
}

export async function backendGetJson<TResponse>(path: string): Promise<TResponse> {
  let response = await performAuthenticatedRequest(path)

  if (response.status === 401) {
    cachedToken = null
    response = await performAuthenticatedRequest(path)
  }

  if (!response.ok) {
    const message = await parseBackendError(response)
    throw new BackendRequestError(message, response.status)
  }

  return (await response.json()) as TResponse
}

export async function backendPostJson<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
  let response = await performAuthenticatedRequest(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (response.status === 401) {
    cachedToken = null
    response = await performAuthenticatedRequest(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  }

  if (!response.ok) {
    const message = await parseBackendError(response)
    throw new BackendRequestError(message, response.status)
  }

  return (await response.json()) as TResponse
}

export function getBackendErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof BackendRequestError) {
    return error.message
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return fallbackMessage
}
