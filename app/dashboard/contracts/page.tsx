"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { STATUS_CONFIG, FINALIZED_STATUSES } from "@/lib/contract-status"
import type { ApiContract, ApiContractsResponse } from "@/lib/backend/types"

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ApiContract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadContracts(): Promise<void> {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch("/api/contracts", { cache: "no-store" })

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string }
          throw new Error(payload.message ?? "No se pudieron cargar los contratos.")
        }

        const payload = (await response.json()) as ApiContractsResponse

        if (isMounted) {
          setContracts(payload.data)
        }
      } catch (error: unknown) {
        if (isMounted) {
          if (error instanceof Error && error.message.length > 0) {
            setErrorMessage(error.message)
          } else {
            setErrorMessage("No se pudieron cargar los contratos.")
          }
          setContracts([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadContracts()

    return () => {
      isMounted = false
    }
  }, [])

  const activeContracts = useMemo(
    () => contracts.filter((contract: ApiContract) => !FINALIZED_STATUSES.includes(contract.status)),
    [contracts]
  )

  const completedContracts = useMemo(
    () => contracts.filter((contract: ApiContract) => FINALIZED_STATUSES.includes(contract.status)),
    [contracts]
  )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Mis contratos</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Contratos creados</p>
          </div>
          <Button size="sm">Nuevo</Button>
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? <p className="text-sm text-muted-foreground">Cargando contratos...</p> : null}

        {!isLoading && !errorMessage && contracts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay contratos para este usuario.</p>
        ) : null}

        <div className="space-y-4">
          {activeContracts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Activos
              </h2>
              {activeContracts.map((contract) => {
                const statusInfo = STATUS_CONFIG[contract.status]
                return (
                  <Link
                    key={contract.id}
                    href={`/dashboard/contracts/${contract.id}`}
                    className="block"
                  >
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-sm font-medium leading-tight">{contract.title}</h3>
                          <Badge variant="outline" className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex gap-4">
                            <span>{contract.developer}</span>
                            <span>{contract.dueDate}</span>
                          </div>
                          <span className="font-medium">{contract.amountLabel}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}

          {completedContracts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Historial
              </h2>
              {completedContracts.map((contract) => {
                const statusInfo = STATUS_CONFIG[contract.status]
                return (
                  <Link
                    key={contract.id}
                    href={`/dashboard/contracts/${contract.id}`}
                    className="block opacity-75"
                  >
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-sm font-medium leading-tight">{contract.title}</h3>
                          <Badge variant="outline" className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex gap-4">
                            <span>{contract.developer}</span>
                            <span>{contract.dueDate}</span>
                          </div>
                          <span className="font-medium">{contract.amountLabel}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
