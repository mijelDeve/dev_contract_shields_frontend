import { NextResponse } from "next/server"
import { backendGetJson, getBackendErrorMessage } from "@/lib/backend/client"
import { mapBackendContract } from "@/lib/backend/mappers"
import type { BackendContractsResponse } from "@/lib/backend/types"

export const runtime = "nodejs"

export async function GET(): Promise<NextResponse> {
  try {
    const response = await backendGetJson<BackendContractsResponse>("/contracts")

    return NextResponse.json({
      data: response.data.map(mapBackendContract),
      pagination: response.pagination,
    })
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "No se pudieron obtener los contratos.")
    return NextResponse.json({ message }, { status: 500 })
  }
}
