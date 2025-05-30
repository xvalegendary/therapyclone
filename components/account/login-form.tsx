"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"
import { useToast } from "@/components/toast/toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createTranslator } from "@/lib/translation-helper"

interface LoginFormProps {
  onLoginSuccess: (token: string) => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("test@example.com") // Предзаполненный тестовый email
  const [password, setPassword] = useState("password123") // Предзаполненный тестовый пароль
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { theme } = useTheme()
  const { language } = useLanguage()
  const t = createTranslator(language)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Сохраняем токен в localStorage
      localStorage.setItem("token", data.token)

      showToast(t("account.loginSuccess", "Login successful"), "success")
      onLoginSuccess(data.token)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || t("account.loginError", "Login failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("account.email", "Email")}
        </label>
        <Input
          id="email"
          type="login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("account.password", "Password")}
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="text-right">
        <a
          href="#"
          className={`text-sm ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
        >
          {t("account.forgotPassword", "Forgot Password?")}
        </a>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("account.loggingIn", "Logging in...")}
          </>
        ) : (
          t("account.login", "Login")
        )}
      </Button>
    </form>
  )
}
