"use client"

import { X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useLanguage } from "@/context/language-context"
import Image from "next/image"
import { useState } from "react"
import { CheckoutModal } from "./checkout-modal"

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, totalPrice } = useCart()
  const { t } = useLanguage()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (!isCartOpen) return null

  const handleCheckout = () => {
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-lg">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{t("cart.title")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground mb-4">{t("cart.empty")}</p>
                  <Button onClick={() => setIsCartOpen(false)}>{t("cart.continueShopping")}</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price}</p>

                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t("cart.total")}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  {t("cart.checkout")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        totalPrice={totalPrice}
      />
    </>
  )
}
