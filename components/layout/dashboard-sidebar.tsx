"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FilePlus, Files, Settings, LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { label: "Crear contrato", href: "/dashboard", icon: FilePlus },
  { label: "Mis contratos", href: "/dashboard/contracts", icon: Files },
  { label: "Ajustes", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <Avatar className="size-8">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            Usuario Demo
          </p>
          <p className="text-xs text-muted-foreground">cliente</p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 text-sm ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut className="size-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
