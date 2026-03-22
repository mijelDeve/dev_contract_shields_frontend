import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session"

export const runtime = "nodejs"

const BACKEND_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"

interface RepositoryPayload {
  githubRepoUrl?: string
}

interface UpdateRepositoryRouteProps {
  params: Promise<{ id: string }>
}

interface BackendAttempt {
  readonly method: "PATCH" | "PUT" | "POST"
  readonly path: string
  readonly body: Record<string, string>
}

const REQUEST_TIMEOUT_MS = 8_000

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
  } catch {
    return false
  }
}

async function tryBackendUpdate(attempt: BackendAttempt, accessToken: string): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    return await fetch(`${BACKEND_BASE_URL}${attempt.path}`, {
      method: attempt.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attempt.body),
      cache: "no-store",
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function POST(
  request: Request,
  { params }: UpdateRepositoryRouteProps
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

    if (!accessToken) {
      return NextResponse.json({ message: "No autenticado." }, { status: 401 })
    }

    const { id } = await params
    const payload = (await request.json()) as RepositoryPayload
    const githubRepoUrl = payload.githubRepoUrl?.trim() ?? ""

    if (!githubRepoUrl) {
      return NextResponse.json({ message: "La URL del repositorio es requerida." }, { status: 400 })
    }

    if (!isValidUrl(githubRepoUrl)) {
      return NextResponse.json({ message: "Ingresa una URL valida (http/https)." }, { status: 400 })
    }

    const attempts: BackendAttempt[] = [
      {
        method: "PATCH",
        path: `/contracts/${id}`,
        body: { githubRepoUrl },
      },
      {
        method: "PATCH",
        path: `/contracts/${id}`,
        body: { github_repo_url: githubRepoUrl },
      },
      {
        method: "PATCH",
        path: `/contracts/${id}/repository`,
        body: { githubRepoUrl },
      },
      {
        method: "PATCH",
        path: `/contracts/${id}/repository`,
        body: { github_repo_url: githubRepoUrl },
      },
      {
        method: "PUT",
        path: `/contracts/${id}`,
        body: { githubRepoUrl },
      },
      {
        method: "POST",
        path: `/contracts/${id}/repository`,
        body: { githubRepoUrl },
      },
    ]

    let lastErrorStatus = 500

    for (const attempt of attempts) {
      const response = await tryBackendUpdate(attempt, accessToken)
      if (response.ok) {
        return NextResponse.json({ success: true, githubRepoUrl })
      }

      lastErrorStatus = response.status
    }

    return NextResponse.json(
      {
        message:
          "No se pudo guardar la URL. Tu backend no expone un endpoint compatible para actualizar el repositorio.",
      },
      { status: lastErrorStatus >= 400 ? lastErrorStatus : 502 }
    )
  } catch {
    return NextResponse.json({ message: "No se pudo guardar la URL del repositorio." }, { status: 500 })
  }
}
