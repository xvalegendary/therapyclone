"use client"

import Image from "next/image"
import { useTheme } from "@/context/theme-context"

export function Logo() {
  const { theme } = useTheme()

  return (
    <div className="relative w-24 h-24">
      <Image
        src={
          theme === "dark"
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20sdfm-gDlxg0zxe6wVV9o5cISteykVa4LQhz.png"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-black-4Nt9Iy9Iy9Iy9Iy9Iy9Iy.png"
        }
        alt="SDFM 2520"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
