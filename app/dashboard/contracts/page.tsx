"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { STATUS_CONFIG, FINALIZED_STATUSES, type ContractStatus } from "@/lib/contract-status"

interface Contract {
  id: string
  title: string
  developer: string
  amount: string
  status: ContractStatus
  dueDate: string
}

const mockContracts: Contract[] = [
  {
    id: "1",
    title: "API REST para e-commerce",
    developer: "dev_alex",
    amount: "2.5 ETH",
    status: "under_review",
    dueDate: "2026-04-15",
  },
  {
    id: "2",
    title: "Dashboard administrativo",
    developer: "sarah_codes",
    amount: "1.8 ETH",
    status: "testing",
    dueDate: "2026-03-28",
  },
  {
    id: "3",
    title: "Sistema de autenticación",
    developer: "dev_mike",
    amount: "1.2 ETH",
    status: "approved",
    dueDate: "2026-03-10",
  },
  {
    id: "4",
    title: "Módulo de pagos",
    developer: "code_ninja",
    amount: "3.0 ETH",
    status: "created",
    dueDate: "2026-05-01",
  },
  {
    id: "5",
    title: "Landing page corporativa",
    developer: "web_wizard",
    amount: "0.5 ETH",
    status: "finalized",
    dueDate: "2026-02-15",
  },
]

export default function ContractsPage() {
  const activeContracts = mockContracts.filter(
    (c) => !FINALIZED_STATUSES.includes(c.status)
  )
  const completedContracts = mockContracts.filter((c) =>
    FINALIZED_STATUSES.includes(c.status)
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Mis contratos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Contratos creados
          </p>
        </div>
        <Button size="sm">Nuevo</Button>
      </div>

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
                        <h3 className="text-sm font-medium leading-tight">
                          {contract.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 text-xs ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex gap-4">
                          <span>{contract.developer}</span>
                          <span>{contract.dueDate}</span>
                        </div>
                        <span className="font-medium">{contract.amount}</span>
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
                        <h3 className="text-sm font-medium leading-tight">
                          {contract.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 text-xs ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex gap-4">
                          <span>{contract.developer}</span>
                          <span>{contract.dueDate}</span>
                        </div>
                        <span className="font-medium">{contract.amount}</span>
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
  )
}
