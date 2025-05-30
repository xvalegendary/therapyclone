"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/context/language-context"
import Image from "next/image"

type Language = {
  code: "en" | "ru"
  name: string
  flag: string
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    code: "ru",
    name: "Русский",
    flag: "https://flagcdn.com/w40/ru.png",
  },
]

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  // Find the selected language object
  const selectedLanguage = languages.find((lang) => lang.code === language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".language-selector")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang.code)
    setIsOpen(false)
  }

  return (
    <div className="language-selector relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="relative w-5 h-5 overflow-hidden rounded-sm">
          <Image
            src={selectedLanguage.flag || "/placeholder.svg"}
            alt={selectedLanguage.name}
            fill
            className="object-cover"
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 bg-background border"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-muted transition-colors ${
                    selectedLanguage.code === lang.code ? "font-medium" : "font-normal"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative w-5 h-5 overflow-hidden rounded-sm">
                      <Image src={lang.flag || "/placeholder.svg"} alt={lang.name} fill className="object-cover" />
                    </div>
                    <span>{lang.name}</span>
                  </div>
                  {selectedLanguage.code === lang.code && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
