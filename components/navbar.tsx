"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Github, User, ShoppingBag, Search, Heart, Settings } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { useUser } from "@/context/user-context"
import { useLanguage } from "@/context/language-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { UserAvatar } from "@/components/user-avatar"
import Link from "next/link"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const { setIsCartOpen, totalItems } = useCart()
  const { setIsOpen: setIsFavoritesOpen, totalItems: favoritesCount } = useFavorites()
  const { user } = useUser()
  const { t } = useLanguage()
  const router = useRouter()


  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openCart = () => {
    setIsCartOpen(true)
  }

  const openFavorites = () => {
    setIsFavoritesOpen(true)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-40 border-b bg-background/80 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left side - Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image src="/logo.svg" alt="SDFM 2520" fill className="object-contain" priority />
              </div>
              <span className="text-xl font-bold hidden sm:block">SDFM 2520</span>
            </Link>

           
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("search.placeholder", "Search products...")}
                  className="w-full pl-10 pr-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-full transition-colors hover:bg-accent md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </motion.button>

        
              <LanguageSelector />

              <ThemeToggle />

            
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full transition-colors hover:bg-accent"
              >
                <Github className="h-5 w-5" />
              </motion.a>

            
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-full transition-colors hover:bg-accent"
                onClick={openFavorites}
              >
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center bg-red-500 text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </motion.button>

          
              {user ? (
                <div className="flex items-center space-x-2">
                  <UserAvatar user={user} size="sm" />
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full transition-colors hover:bg-accent"
                        title={t("admin.panel", "Admin Panel")}
                      >
                        <Settings className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full transition-colors hover:bg-accent"
                  >
                    <User className="h-5 w-5" />
                  </motion.div>
                </Link>
              )}

              {/* Cart */}
              <motion.button
                className="relative p-2 rounded-full transition-colors hover:bg-accent"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center bg-primary text-primary-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Dropdown */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="mt-4 md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t("search.placeholder", "Search products...")}
                    className="w-full pl-10 pr-4 py-2 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}
