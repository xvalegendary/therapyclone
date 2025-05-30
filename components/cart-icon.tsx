"use client"

import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useCart } from "@/context/cart-context"

export function CartIcon() {
  const [isClicked, setIsClicked] = useState(false)
  const { setIsCartOpen } = useCart()

  const handleClick = () => {
    setIsClicked(true)
    setIsCartOpen(true)
    setTimeout(() => setIsClicked(false), 300) // Reset after animation
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`p-2 rounded-full bg-dark-400 hover:bg-dark-300 transition-colors duration-200 ${
        isClicked ? "animate-click" : ""
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ShoppingCart className="w-6 h-6 text-gray-100" />
    </motion.button>
  )
}
