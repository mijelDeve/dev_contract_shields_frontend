"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="mx-auto max-w-3xl">
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Ajustes</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                Nombre
              </Label>
              <Input
                id="name"
                defaultValue="Usuario Demo"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="usuario@example.com"
                className="h-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wallet" className="text-xs">
              Wallet address
            </Label>
            <Input
              id="wallet"
              defaultValue="0x1234...5678"
              className="h-9 font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm">Email notifications</p>
              <p className="text-xs text-muted-foreground">
                Recibir alertas sobre tus contratos
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="size-4 rounded border-border accent-primary"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm">Actualizaciones de estado</p>
              <p className="text-xs text-muted-foreground">
                Notificar cambios en contratos
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="size-4 rounded border-border accent-primary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
    </div>
  )
}
