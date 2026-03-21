"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

export function ThemeToggle() {
  const context = useTheme()
  const theme = context?.theme || "light"
  const toggleTheme = context?.toggleTheme || (() => {})

  return (
    <button
      onClick={toggleTheme}
      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  )
}
