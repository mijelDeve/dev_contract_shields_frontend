"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("theme") as Theme | null
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [isHydrated, setIsHydrated] = useState(false)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    
    const initial = getStoredTheme() || getSystemTheme()
    applyTheme(initial)
    setTheme(initial)
    setIsHydrated(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", next)
      applyTheme(next)
      return next
    })
  }, [])

  if (!isHydrated) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return { theme: "light" as Theme, toggleTheme: () => {} }
  }
  return context
}
