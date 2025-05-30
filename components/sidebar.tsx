"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Flame, Star, Sparkles, Zap, ShoppingBag, User, Github } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { setIsCartOpen } = useCart()
  const { theme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollToProducts = () => {
    const productSection = document.getElementById("product-section")
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const filterProducts = (category: string) => {
    const event = new CustomEvent("filterProducts", { detail: { category } })
    window.dispatchEvent(event)
    setIsOpen(false)
    scrollToProducts()
  }

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMobile ? "top-4 left-4" : "top-6 left-6"} z-50 p-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-md ${
          theme === "dark"
            ? "bg-gray-900/80 hover:bg-gray-800/90 text-white border border-gray-700/50"
            : "bg-white/80 hover:bg-gray-50/90 text-gray-900 border border-gray-200/50"
        }`}
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className={`fixed top-0 left-0 h-full ${isMobile ? "w-full" : "w-80"} z-50 shadow-2xl backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-gray-900/95 border-r border-gray-700/50"
                  : "bg-white/95 border-r border-gray-200/50"
              }`}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                {theme === "dark" ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-gray-50/50" />
                )}

                {/* Floating dots */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${theme === "dark" ? "bg-white/10" : "bg-gray-900/10"}`}
                    initial={{
                      x: Math.random() * 100,
                      y: Math.random() * 100,
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 15 + Math.random() * 10,
                      ease: "linear",
                    }}
                    style={{
                      width: `${Math.random() * 60 + 20}px`,
                      height: `${Math.random() * 60 + 20}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200/20">
                  <div className="flex-1" />
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-2xl font-bold tracking-wider ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    SDFM
                  </motion.h1>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`p-2 rounded-full transition-colors ${
                        theme === "dark" ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex-1 p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3
                      className={`text-sm uppercase tracking-wider mb-6 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("nav.categories")}
                    </h3>

                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => filterProducts("new-arrival")}
                        className={`w-full flex items-center p-4 rounded-xl transition-all group ${
                          theme === "dark"
                            ? "hover:bg-white/10 text-white/90 hover:text-white"
                            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-orange-500/20 mr-4 group-hover:bg-orange-500/30 transition-colors">
                          <Flame className="h-5 w-5 text-orange-500" />
                        </div>
                        <span className="font-medium">{t("nav.newArrivals")}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => filterProducts("best-seller")}
                        className={`w-full flex items-center p-4 rounded-xl transition-all group ${
                          theme === "dark"
                            ? "hover:bg-white/10 text-white/90 hover:text-white"
                            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-yellow-500/20 mr-4 group-hover:bg-yellow-500/30 transition-colors">
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                        <span className="font-medium">{t("nav.bestSellers")}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => filterProducts("limited-edition")}
                        className={`w-full flex items-center p-4 rounded-xl transition-all group ${
                          theme === "dark"
                            ? "hover:bg-white/10 text-white/90 hover:text-white"
                            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-purple-500/20 mr-4 group-hover:bg-purple-500/30 transition-colors">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="font-medium">{t("nav.limitedEdition")}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => filterProducts("all")}
                        className={`w-full flex items-center p-4 rounded-xl transition-all group ${
                          theme === "dark"
                            ? "hover:bg-white/10 text-white/90 hover:text-white"
                            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-blue-500/20 mr-4 group-hover:bg-blue-500/30 transition-colors">
                          <Zap className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="font-medium">{t("nav.allProducts")}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Footer Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`p-6 border-t ${theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"}`}
                >
                  <div className="flex justify-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsCartOpen(true)
                        setIsOpen(false)
                      }}
                      className={`p-3 rounded-xl transition-all ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </motion.button>

                    <motion.a
                      href="/account"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                      className={`p-3 rounded-xl transition-all ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <User className="h-5 w-5" />
                    </motion.a>

                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl transition-all ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <Github className="h-5 w-5" />
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
