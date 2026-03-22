"use client"

import { useState, useEffect, useRef } from "react"

interface LogEntry {
  id: number
  timestamp: string
  level: "info" | "warn" | "error" | "success"
  message: string
}

const DEMO_LOGS: LogEntry[] = [
  { id: 1, timestamp: "10:23:45", level: "info", message: "Iniciando conexión con GenLayer..." },
  { id: 2, timestamp: "10:23:46", level: "info", message: "Conexión establecida exitosamente" },
  { id: 3, timestamp: "10:23:47", level: "info", message: "Enviando transacción al智能合约..." },
  { id: 4, timestamp: "10:23:48", level: "info", message: "Transaction Hash: 0x7a8b...3f2e" },
  { id: 5, timestamp: "10:23:50", level: "warn", message: "Esperando confirmación de red..." },
  { id: 6, timestamp: "10:24:01", level: "success", message: "Transacción confirmada en bloque #12345678" },
  { id: 7, timestamp: "10:24:02", level: "info", message: "Validadores iniciando evaluación..." },
  { id: 8, timestamp: "10:24:15", level: "info", message: "5/10 validadores han respondido" },
  { id: 9, timestamp: "10:24:30", level: "info", message: "10/10 validadores han respondido" },
  { id: 10, timestamp: "10:24:31", level: "success", message: "Veredicto: APROBADO" },
  { id: 11, timestamp: "10:24:32", level: "info", message: "Liberando fondos al desarrollador..." },
  { id: 12, timestamp: "10:24:33", level: "success", message: "Fondos transferidos: 2.5 ETH" },
]

const LEVEL_COLORS: Record<string, string> = {
  info: "text-zinc-400",
  warn: "text-yellow-400",
  error: "text-red-400",
  success: "text-green-400",
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(true)
  const demoIdRef = useRef(0)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const interval = setInterval(() => {
      if (demoIdRef.current < DEMO_LOGS.length) {
        const newLog = DEMO_LOGS[demoIdRef.current]
        setLogs((prev) => {
          if (!newLog) return prev
          return [...prev, { ...newLog }]
        })
        demoIdRef.current++
      } else {
        clearInterval(interval)
        setIsConnected(false)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (containerRef.current && shouldScrollRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

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

  return (
    <div className="flex flex-col rounded-lg border bg-black font-mono text-xs">
      <div className="flex items-center justify-between border-b border-zinc-700 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500" />
            <div className="size-2.5 rounded-full bg-yellow-500" />
            <div className="size-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-zinc-500">terminal</span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-green-500">
              <span className="size-1.5 rounded-full bg-green-500" />
              Conectado
            </span>
          ) : (
            <span className="text-zinc-500">Desconectado</span>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-64 overflow-y-auto p-3 space-y-1"
      >
        {logs.length === 0 ? (
          <span className="text-zinc-600">Esperando logs...</span>
        ) : (
          logs.map((log) => {
            if (!log) return null
            return (
              <div key={log.id} className="flex gap-3">
                <span className="text-zinc-600">
                  [{log.timestamp ?? "00:00:00"}]
                </span>
                <span className={`uppercase ${LEVEL_COLORS[log.level] ?? LEVEL_COLORS.info}`}>
                  [{log.level ?? "info"}]
                </span>
                <span className="text-zinc-300">{log.message ?? ""}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
