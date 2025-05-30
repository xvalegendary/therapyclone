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

interface RegisterFormProps {
  onRegisterSuccess: () => void
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t("account.passwordsDoNotMatch", "Passwords do not match"))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      showToast(t("account.registerSuccess", "Registration successful!"), "success")
      onRegisterSuccess()
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || t("account.registerError", "Registration failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
          {t("account.name", "Name")}
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("account.namePlaceholder", "Your name")}
          required
          className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="register-email"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("account.email", "Email")}
        </label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="register-password"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("account.password", "Password")}
        </label>
        <div className="relative">
          <Input
            id="register-password"
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

      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("account.confirmPassword", "Confirm Password")}
        </label>
        <Input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("account.registering", "Registering...")}
          </>
        ) : (
          t("account.register", "Register")
        )}
      </Button>
    </form>
  )
}
