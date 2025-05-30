"use client"

import { ShoppingBag, Moon, Sun, Heart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { useUser } from "@/context/user-context"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FavoritesDrawer } from "@/components/favorites-drawer"
import { UserAvatar } from "@/components/user-avatar"
import { LanguageSelector } from "@/components/language-selector"

export function Header() {
  const { totalItems, setIsCartOpen } = useCart()
  const { totalItems: favoritesCount, setIsOpen: setIsFavoritesOpen } = useFavorites()
  const { user, logout } = useUser()
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isFavoritesOpen, setFavoritesOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-foreground text-background rounded-md font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-lg">SDFM</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-foreground/80 transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-foreground/80 transition-colors">
              {t("nav.shop")}
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-foreground/80 transition-colors">
              {t("nav.about")}
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                {t("nav.admin")}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setFavoritesOpen(true)}>
              <Heart className="h-4 w-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/account">
                  <UserAvatar user={user} size="sm" />
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.role === "admin" ? t("common.admin") : user.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t("auth.logout")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t("auth.signIn")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t("auth.signUp")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </>
  )
}
