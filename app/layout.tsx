import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { PromoBanner } from "@/components/promo-banner"
import { Header } from "@/components/header"
import { CartProvider } from "@/context/cart-context"
import { FavoritesProvider } from "@/context/favorites-context"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/context/user-context"
import { LanguageProvider } from "@/context/language-context"
import { MobileSidebar } from "@/components/mobile-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "therapy - minimalism, sports hoodies.",
  description: "therapy for you",
}

console.warn('[~] T2T2RSTAN PROTECTION ENABLED')
console.warn('[+] SHAYTAN MASHINA PROTECTION STATE 2 LOADED')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <UserProvider>
              <CartProvider>
                <FavoritesProvider>
                  <PromoBanner />
                  <Header />
                  <MobileSidebar />
                  {children}
                  <CartDrawer />
                  <Toaster />
                </FavoritesProvider>
              </CartProvider>
            </UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
