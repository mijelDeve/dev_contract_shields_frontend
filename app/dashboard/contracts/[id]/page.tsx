"use client"

import Link from "next/link"
import { use } from "react"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { STATUS_CONFIG, type ContractStatus } from "@/lib/contract-status"
import { LogViewer } from "@/components/log-viewer"

interface ContractDetailPageProps {
  params: Promise<{ id: string }>
}

const mockContract = {
  id: "1",
  title: "API REST para e-commerce",
  description:
    "Desarrollo de una API REST completa para un sistema de e-commerce. Incluye gestión de productos, carrito de compras, procesamiento de pagos y sistema de notificaciones.",
  developer: "dev_alex",
  amount: "2.5 ETH",
  currency: "ETH",
  startDate: "2026-03-01",
  dueDate: "2026-04-15",
  status: "under_review" as ContractStatus,
  genlayerTx: "0x7a8b...3f2e",
  createdAt: "2026-02-28",
}

export default function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { id } = use(params)
  const contract = { ...mockContract, id }
  const statusInfo = STATUS_CONFIG[contract.status]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contracts">
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">{contract.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Contrato #{contract.id}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Detalles del contrato</h2>
            <span
              className={`rounded border px-1.5 py-0.5 text-xs ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Descripción</p>
            <p className="text-sm">{contract.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Desarrollador</p>
              <p className="text-sm font-medium">{contract.developer}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Monto</p>
              <p className="text-sm font-medium">
                {contract.amount} {contract.currency}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Fecha de inicio</p>
              <p className="text-sm">{contract.startDate}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Fecha de entrega</p>
              <p className="text-sm">{contract.dueDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-sm font-medium">Estado actual</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium">{statusInfo.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {statusInfo.message}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-sm font-medium">Transacción GenLayer</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">Hash de transacción</p>
          <p className="mt-1 font-mono text-xs">{contract.genlayerTx}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-sm font-medium">Terminal</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <LogViewer />
        </CardContent>
      </Card>
    </div>
  )
}
