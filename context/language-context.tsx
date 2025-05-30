"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Language } from "@/lib/translations"
import { createTranslator } from "@/lib/translation-helper"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Загрузка языка из localStorage при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ru")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Сохранение языка в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Переключение языка
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "ru" : "en"))
  }

  // Создаем функцию перевода для текущего языка
  const t = (key: string, fallback?: string) => createTranslator(language)(key, fallback)

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
