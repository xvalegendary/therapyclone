"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { ProductModal } from "@/components/product-modal"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

interface HoodieCardProps {
  id: string
  name: string
  price: number
  image: string
  description: string
  images?: string[]
  isAdmin?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function HoodieCard({
  id,
  name,
  price,
  image,
  description,
  images = [],
  isAdmin = false,
  onEdit,
  onDelete,
}: HoodieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()
  const cardRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const t = translations[language]
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const toggleFavorite = () => {
    if (isInFavorites(id)) {
      removeFromFavorites(id)
    } else {
      addToFavorites({ id, name, price, image })
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Предотвращение множественных кликов
    if (isAddingToCart) return

    setIsAddingToCart(true)
    addToCart({ id, name, price, image })

    // Сбрасываем флаг через небольшую задержку
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(id)
    }
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        className="relative group bg-dark-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-50" />

          <motion.button
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isInFavorites(id) ? "bg-red-500" : "bg-dark-700"
            } z-10`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite()
            }}
          >
            <Heart className={`h-5 w-5 ${isInFavorites(id) ? "text-white fill-current" : "text-white"}`} />
          </motion.button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-gray-400 mt-1">${price.toFixed(2)}</p>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {t.addToCart}
            </Button>
          </motion.div>

          {/* Admin Panel */}
          {isAdmin && (
            <motion.div
              className="mt-3 flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30"
                onClick={handleViewDetails}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-yellow-600/20 border-yellow-500 text-yellow-400 hover:bg-yellow-600/30"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {isModalOpen && (
        <ProductModal product={{ id, name, price, image, description, images }} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}
