"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

const images = [
  "https://64.media.tumblr.com/db8472cfbb89a155148003b053d5f3de/4d6d987e0cee7307-8e/s400x225/158142e8e876044a6191733a02f6ee5ac1643b58.gif",
  "https://i.pinimg.com/originals/14/f4/35/14f435eaaf8d107cca5055ce150eaf47.gif",
]

export function AutoSliderBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { theme } = useTheme()
  const { language } = useLanguage()

  // Получаем переводы для текущего языка
  const t = translations[language]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleShopClick = () => {
    const productSection = document.getElementById("product-section")
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={`Banner ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white text-center mb-4">
          {t.banner?.title || "Premium Hoodies Collection"}
        </h1>
        <p className="text-xl text-white text-center mb-8">{t.banner?.subtitle || "Comfort meets style"}</p>
        <Button
          onClick={handleShopClick}
          size="lg"
          variant="outline"
          className={`${theme === "dark" ? "text-white border-white hover:bg-white/20" : "text-black border-white bg-white hover:bg-white/80"}`}
        >
          {t.banner?.shop || "Shop Now"}
        </Button>
      </div>
    </div>
  )
}
