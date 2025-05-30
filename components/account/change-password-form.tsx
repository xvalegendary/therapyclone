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

interface ChangePasswordFormProps {
  token: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ChangePasswordForm({ token, onSuccess, onCancel }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { theme } = useTheme()
  const { language } = useLanguage()
  const t = createTranslator(language)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Проверяем, что новый пароль и подтверждение совпадают
    if (newPassword !== confirmPassword) {
      setError(t("account.passwordsDoNotMatch", "Passwords do not match"))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      showToast(t("passwordChangedSuccess", "Password changed successfully"), "success")

      // Очищаем форму
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Вызываем callback при успешной смене пароля
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error changing password:", error)
      setError(error.message || t("passwordChangeError", "An error occurred while changing password"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="current-password"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("currentPassword", "Current Password")}
        </label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`${
              theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("newPassword", "New Password")}
        </label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`${
              theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
        >
          {t("confirmPassword", "Confirm New Password")}
        </label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className={`${
            theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
          }`}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel", "Cancel")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("changing", "Changing...")}
            </>
          ) : (
            t("changePassword", "Change Password")
          )}
        </Button>
      </div>
    </form>
  )
}
