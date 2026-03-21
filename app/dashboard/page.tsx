"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeveloperSelect } from "@/components/forms/developer-select"

export default function CreateContractPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [developer, setDeveloper] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!developer) return
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 1000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Crear nuevo contrato</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Define los detalles del proyecto y asigna un desarrollador
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Detalles del contrato</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs">
                Nombre del contrato
              </Label>
              <Input
                id="title"
                placeholder="Ej: Desarrollo de API REST"
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Describe los requisitos del proyecto..."
                className="min-h-20 resize-none"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs">
                  Monto
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-xs">
                  Cryptomoneda
                </Label>
                <Select defaultValue="ETH">
                  <SelectTrigger id="currency" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="MATIC">MATIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-xs">
                  Fecha de inicio
                </Label>
                <Input id="startDate" type="date" className="h-9" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dueDate" className="text-xs">
                  Fecha de entrega
                </Label>
                <Input id="dueDate" type="date" className="h-9" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Desarrollador destino</Label>
              <DeveloperSelect value={developer} onChange={setDeveloper} />
              <input type="hidden" name="developer" value={developer} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm">
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || !developer}>
                {isSubmitting ? "Creando..." : "Crear contrato"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
