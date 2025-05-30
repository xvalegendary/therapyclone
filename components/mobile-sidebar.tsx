"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Home, ShoppingBag, Info, User, Github, Menu, X, ChevronRight, Flame, Star, Sparkles, Zap } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"

export function MobileSidebar() {
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

  // Закрытие при изменении размера экрана
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false)
    }
  }, [isMobile, isOpen])

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

  if (!isMobile) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 ${
          theme === "dark" ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
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
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`fixed top-0 left-0 h-full w-full z-50 shadow-2xl overflow-hidden ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    SDFM 2520
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-full ${
                      theme === "dark" ? "hover:bg-white/10 text-white" : "hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1">
                  <ul className="space-y-4">
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Link
                        href="/"
                        className={`flex items-center text-lg ${
                          theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"
                        } transition-colors`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Home className="h-6 w-6 mr-4" />
                        <span>{t("nav.home")}</span>
                        <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                      </Link>
                    </motion.li>

                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <button
                        onClick={scrollToProducts}
                        className={`flex items-center text-lg ${
                          theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"
                        } transition-colors w-full`}
                      >
                        <ShoppingBag className="h-6 w-6 mr-4" />
                        <span>{t("nav.shop")}</span>
                        <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                      </button>
                    </motion.li>

                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Link
                        href="/about"
                        className={`flex items-center text-lg ${
                          theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"
                        } transition-colors`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Info className="h-6 w-6 mr-4" />
                        <span>{t("nav.about")}</span>
                        <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                      </Link>
                    </motion.li>

                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Link
                        href="/account"
                        className={`flex items-center text-lg ${
                          theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"
                        } transition-colors`}
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-6 w-6 mr-4" />
                        <span>{t("account.title")}</span>
                        <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                      </Link>
                    </motion.li>
                  </ul>

                  <div className={`mt-8 pt-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                    <h3 className={`text-sm uppercase ${theme === "dark" ? "text-white/50" : "text-gray-500"} mb-4`}>
                      {t("nav.featured")}
                    </h3>
                    <ul className="space-y-3">
                      <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                        <button
                          onClick={() => filterProducts("new-arrival")}
                          className={`flex items-center ${
                            theme === "dark" ? "text-white/80 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                          } transition-colors w-full`}
                        >
                          <Flame className="h-5 w-5 mr-3 text-orange-500" />
                          <span>{t("nav.newArrivals")}</span>
                        </button>
                      </motion.li>

                      <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                        <button
                          onClick={() => filterProducts("best-seller")}
                          className={`flex items-center ${
                            theme === "dark" ? "text-white/80 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                          } transition-colors w-full`}
                        >
                          <Star className="h-5 w-5 mr-3 text-yellow-500" />
                          <span>{t("nav.bestSellers")}</span>
                        </button>
                      </motion.li>

                      <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                        <button
                          onClick={() => filterProducts("limited-edition")}
                          className={`flex items-center ${
                            theme === "dark" ? "text-white/80 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                          } transition-colors w-full`}
                        >
                          <Sparkles className="h-5 w-5 mr-3 text-purple-500" />
                          <span>{t("nav.limitedEdition")}</span>
                        </button>
                      </motion.li>

                      <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                        <button
                          onClick={() => filterProducts("all")}
                          className={`flex items-center ${
                            theme === "dark" ? "text-white/80 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                          } transition-colors w-full`}
                        >
                          <Zap className="h-5 w-5 mr-3 text-blue-500" />
                          <span>All Products</span>
                        </button>
                      </motion.li>
                    </ul>
                  </div>
                </nav>

                <div className={`mt-auto pt-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                  <div className="flex justify-center space-x-6">
                    <Link href="/account">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-full ${
                          theme === "dark"
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        } transition-colors`}
                      >
                        <User className="h-6 w-6" />
                      </motion.div>
                    </Link>

                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-full ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      } transition-colors`}
                    >
                      <Github className="h-6 w-6" />
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-full ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      } transition-colors`}
                      onClick={() => {
                        setIsCartOpen(true)
                        setIsOpen(false)
                      }}
                    >
                      <ShoppingBag className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
