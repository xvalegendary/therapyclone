"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"

export function PromoBanner() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { language } = useLanguage()

  const promoText = {
    en: '🎉 USE CODE "WELCOMESDFM" FOR 15% OFF YOUR FIRST ORDER • FREE SHIPPING ON ORDERS OVER $100 • NEW ARRIVALS EVERY WEEK • LIMITED TIME OFFER •',
    ru: '🎉 ИСПОЛЬЗУЙТЕ КОД "WELCOMESDFM" ДЛЯ СКИДКИ 15% НА ПЕРВЫЙ ЗАКАЗ • БЕСПЛАТНАЯ ДОСТАВКА ОТ $100 • НОВИНКИ КАЖДУЮ НЕДЕЛЮ • ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ •',
  }

  useEffect(() => {
    const marqueeElement = marqueeRef.current
    if (!marqueeElement) return

    // Clone the content to create a seamless loop
    const content = marqueeElement.innerHTML
    marqueeElement.innerHTML = content + content

    // Start the animation
    const animation = marqueeElement.animate([{ transform: "translateX(0)" }, { transform: `translateX(-50%)` }], {
      duration: 40000, // 40 seconds for one full cycle
      iterations: Number.POSITIVE_INFINITY,
    })

    return () => {
      animation.cancel()
    }
  }, [language])

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-2 overflow-hidden whitespace-nowrap relative">
      <div ref={marqueeRef} className="inline-block animate-marquee">
        {promoText[language]} {promoText[language]}
      </div>
    </div>
  )
}
