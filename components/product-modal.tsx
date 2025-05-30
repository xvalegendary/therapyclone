"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Heart, ShoppingBag, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { useLanguage } from "@/context/language-context"

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

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image1,
      })
    }
    onClose()
  }

  const handleToggleFavorite = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
            <Image src={product.image1 || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold mt-2">${product.price}</p>
            </div>

            {product.description && <p className="text-muted-foreground">{product.description}</p>}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("cart.quantity")}</label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={handleAddToCart} className="w-full" size="lg">
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t("addToCart")} - ${(product.price * quantity).toFixed(2)}
              </Button>

              <Button variant="outline" onClick={handleToggleFavorite} className="w-full">
                <Heart className={`h-4 w-4 mr-2 ${isInFavorites(product.id) ? "fill-current text-red-500" : ""}`} />
                {isInFavorites(product.id) ? t("removeFromFavorites") : t("addToFavorites")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
