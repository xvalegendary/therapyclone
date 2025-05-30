"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"

export function TextMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { language } = useLanguage()

  const marqueeText = {
    en: 'FREE SHIPPING ON ALL ORDERS OVER $100 • NEW COLLECTION AVAILABLE NOW • USE CODE "WELCOME10" FOR 10% OFF YOUR FIRST ORDER • LIMITED EDITION ITEMS AVAILABLE •',
    ru: 'БЕСПЛАТНАЯ ДОСТАВКА ДЛЯ ВСЕХ ЗАКАЗОВ ОТ $100 • НОВАЯ КОЛЛЕКЦИЯ УЖЕ ДОСТУПНА • ИСПОЛЬЗУЙТЕ КОД "WELCOME10" ДЛЯ СКИДКИ 10% НА ПЕРВЫЙ ЗАКАЗ • ТОВАРЫ ОГРАНИЧЕННОЙ СЕРИИ В НАЛИЧИИ •',
  }

  useEffect(() => {
    const marqueeElement = marqueeRef.current
    if (!marqueeElement) return

    // Clone the content to create a seamless loop
    const content = marqueeElement.innerHTML
    marqueeElement.innerHTML = content + content

    // Start the animation - significantly slower now (60000ms = 60 seconds for one full cycle)
    const animation = marqueeElement.animate([{ transform: "translateX(0)" }, { transform: `translateX(-50%)` }], {
      duration: 60000, // Slower animation (60 seconds instead of 30)
      iterations: Number.POSITIVE_INFINITY,
    })

    return () => {
      animation.cancel()
    }
  }, [language])

  return (
    <div className="fixed top-0 left-0 w-full bg-black dark:bg-black light:bg-gray-800 text-white py-2 z-50 overflow-hidden whitespace-nowrap">
      <div ref={marqueeRef} className="inline-block">
        {marqueeText[language]} {marqueeText[language]}
      </div>
    </div>
  )
}
