import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { backendPostJson, getBackendErrorMessage } from "@/lib/backend/client"
import type { ChatMessagePayload, ChatResponse } from "@/lib/backend/types"

export const runtime = "nodejs"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ChatMessagePayload
    const response = await backendPostJson<ChatMessagePayload, ChatResponse>(
      "/chat/message",
      body
    )

    return NextResponse.json(response)
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "No se pudo enviar el mensaje al asistente.")
    return NextResponse.json({ message }, { status: 500 })
  }
}
