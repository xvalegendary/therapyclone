"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"
import { createTranslator } from "@/lib/translation-helper"
import { validateUsername, validatePassword, validateEmail, getPasswordStrength } from "@/lib/validation"
import { Eye, EyeOff, Loader2, Check, X, AlertCircle } from "lucide-react"

interface EnhancedRegisterFormProps {
  onSuccess: () => void
}

export function EnhancedRegisterForm({ onSuccess }: EnhancedRegisterFormProps) {
  const [step, setStep] = useState<"register" | "verify">("register")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { theme } = useTheme()
  const { language } = useLanguage()
  const t = createTranslator(language)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Валидация username
    const usernameValidation = validateUsername(formData.username)
    if (!usernameValidation.isValid) {
      newErrors.username = t(`validation.${usernameValidation.message}`, usernameValidation.message)
    }

    // Валидация email
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = t(`validation.${emailValidation.message}`, emailValidation.message)
    }

    // Валидация password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = t(`validation.${passwordValidation.message}`, passwordValidation.message)
    }

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("account.passwordsDoNotMatch", "Passwords do not match")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setStep("verify")
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({ general: t("account.registerError", "Registration failed") })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        setErrors({ verification: data.error })
      }
    } catch (error) {
      setErrors({ verification: t("auth.verificationError", "Verification failed") })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const usernameValidation = validateUsername(formData.username)
  const emailValidation = validateEmail(formData.email)

  if (step === "verify") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {t("auth.verifyEmail", "Verify Your Email")}
          </h2>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {t("auth.verificationSent", "We've sent a verification code to")} {formData.email}
          </p>
        </div>

        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <Label htmlFor="verification-code">{t("auth.verificationCode", "Verification Code")}</Label>
            <Input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={`text-center text-2xl tracking-widest ${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
              maxLength={6}
              required
            />
          </div>

          {errors.verification && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <span>{errors.verification}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || verificationCode.length !== 6}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("auth.verifying", "Verifying...")}
              </>
            ) : (
              t("auth.verify", "Verify")
            )}
          </Button>

          <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("register")}>
            {t("common.back", "Back")}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Username */}
      <div>
        <Label htmlFor="username">{t("auth.username", "Username")} *</Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder={t("auth.usernamePlaceholder", "Enter your username")}
            className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
            required
          />
          {formData.username && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {usernameValidation.isValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        {formData.username && !errors.username && usernameValidation.isValid && (
          <p className="text-green-500 text-sm mt-1">{t("validation.usernameValid", "Username is available")}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">{t("account.email", "Email")} *</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
            required
          />
          {formData.email && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {emailValidation.isValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">{t("account.password", "Password")} *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className={`text-${passwordStrength.color}-500 font-medium`}>
                {t(`auth.password${passwordStrength.label}`, passwordStrength.label)}
              </span>
              <span className="text-gray-500">{passwordStrength.score}/8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <Label htmlFor="confirmPassword">{t("account.confirmPassword", "Confirm Password")} *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••"
            className={`${theme === "dark" ? "bg-dark-700 border-dark-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
            required
          />
          {formData.confirmPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {formData.password === formData.confirmPassword ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      {errors.general && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{errors.general}</span>
        </div>
      )}

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
