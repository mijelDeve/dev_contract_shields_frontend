"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessage {
  readonly id: string
  readonly role: "user" | "assistant"
  readonly content: string
  readonly timestamp: Date
}

interface AiChatProps {
  readonly className?: string
}

const MOCK_RESPONSES = [
  "Interesante. Para ese tipo de proyecto, te recomendaría incluir tests que validen los endpoints principales y los casos de error.",
  "Podríamos considerar pruebas de integración para la base de datos y pruebas unitarias para la lógica de negocio.",
  "Para validación de inputs, sugiero tests que cubran: campos requeridos, formatos inválidos, y límites de longitud.",
  "Los tests de autenticación son críticos. Deberíamos incluir: login válido, credenciales incorrectas, y expiración de tokens.",
  "Te sugiero también incluir tests de rendimiento para los endpoints más utilizados del contrato.",
]

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hola! Soy tu asistente para definir los tests unitarios del contrato. Describe tu proyecto y te ayudaré a identificar qué pruebas necesitas.",
  timestamp: new Date(),
}

export function AiChat({ className }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(true)
  const responseIndexRef = useRef(0)

  useEffect(() => {
    if (containerRef.current && shouldScrollRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
        shouldScrollRef.current = isAtBottom
      }
    }

    const container = containerRef.current
    container?.addEventListener("scroll", handleScroll, { passive: true })
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const responseText = MOCK_RESPONSES[responseIndexRef.current % MOCK_RESPONSES.length]!
    responseIndexRef.current++

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4" />
          Asistente de Tests
        </CardTitle>
        <CardDescription>
          Define las pruebas unitarias para tu contrato
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div
          ref={containerRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-1"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "px-3 py-2 max-w-[85%] text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                    : "bg-muted text-foreground rounded-2xl rounded-bl-md"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="hidden" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t pt-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
