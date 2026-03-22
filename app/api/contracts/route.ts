import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { backendGetJson, getBackendErrorMessage } from "@/lib/backend/client"
import { mapBackendContract } from "@/lib/backend/mappers"
import type { BackendContractsResponse } from "@/lib/backend/types"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session"

export const runtime = "nodejs"

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

    if (!accessToken) {
      return NextResponse.json({ message: "No autenticado." }, { status: 401 })
    }

    const response = await backendGetJson<BackendContractsResponse>("/contracts", accessToken)

    return NextResponse.json({
      data: response.data.map(mapBackendContract),
      pagination: response.pagination,
    })
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "No se pudieron obtener los contratos.")
    return NextResponse.json({ message }, { status: 500 })
  }
}
