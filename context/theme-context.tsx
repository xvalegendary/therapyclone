"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)
    try {
      const storedTheme = localStorage.getItem("theme") as Theme | null

      if (storedTheme) {
        setTheme(storedTheme)
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light")
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return

    try {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      localStorage.setItem("theme", theme)
    } catch (error) {
      console.error("Error updating theme:", error)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}
