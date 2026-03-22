import { NextResponse } from "next/server"
import { backendGetJson, getBackendErrorMessage } from "@/lib/backend/client"
import { mapBackendContract } from "@/lib/backend/mappers"
import type { BackendContract, BackendContractsResponse } from "@/lib/backend/types"

export const runtime = "nodejs"

interface ContractDetailRouteProps {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: ContractDetailRouteProps): Promise<NextResponse> {
  try {
    const { id } = await params
    const response = await backendGetJson<BackendContractsResponse>("/contracts")

    const contract = response.data.find((item: BackendContract) => String(item.id) === id)

    if (!contract) {
      return NextResponse.json({ message: "Contrato no encontrado." }, { status: 404 })
    }

    return NextResponse.json(mapBackendContract(contract))
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "No se pudo obtener el contrato.")
    return NextResponse.json({ message }, { status: 500 })
  }
}
