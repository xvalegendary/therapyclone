"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingBag, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { useLanguage } from "@/context/language-context"
import { ProductModal } from "@/components/product-modal"

interface Product {
  id: string
  name: string
  price: number
  image1: string
  image2?: string
  description?: string
  category: string
  featured: boolean
}

interface ProductCardProps {
  product: Product
  isAdmin?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProductCard({ product, isAdmin, onEdit, onDelete }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()
  const { t } = useLanguage()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image1,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image1,
      })
    }
  }

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-4">
          <Image
            src={product.image1 || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors">
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={handleToggleFavorite}
                title={isInFavorites(product.id) ? t("removeFromFavorites") : t("addToFavorites")}
              >
                <Heart className={`h-4 w-4 ${isInFavorites(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              {isAdmin && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.(product.id)
                    }}
                    title={t("common.edit")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(product.id)
                    }}
                    title={t("common.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" className="w-full" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t("addToCart")}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-base">{product.name}</h3>
          <p className="text-muted-foreground">${(product.price / 100).toFixed(2)}</p>
        </div>
      </div>

      {isModalOpen && <ProductModal product={product} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
