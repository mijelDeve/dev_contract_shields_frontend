import { NextResponse } from "next/server"
import { backendGetJson, getBackendErrorMessage } from "@/lib/backend/client"
import { mapBackendUser } from "@/lib/backend/mappers"
import type { BackendMeResponse } from "@/lib/backend/types"

export const runtime = "nodejs"

export async function GET(): Promise<NextResponse> {
  try {
    const backendUser = await backendGetJson<BackendMeResponse>("/users/me")
    return NextResponse.json(mapBackendUser(backendUser))
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "No se pudo obtener el perfil.")
    return NextResponse.json({ message }, { status: 500 })
  }
}
