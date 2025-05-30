"use client"

import type React from "react"

import { useState } from "react"
import { X, CreditCard, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import type { CartItem } from "@/context/cart-context"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  totalPrice: number
}

export function CheckoutModal({ isOpen, onClose, items, totalPrice }: CheckoutModalProps) {
  const { t } = useLanguage()
  const { clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return

    setIsValidatingPromo(true)
    setPromoError("")

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })

      const data = await response.json()

      if (response.ok) {
        setPromoDiscount(data.discount)
        setPromoApplied(true)
        setPromoError("")
      } else {
        setPromoError(data.error)
        setPromoDiscount(0)
        setPromoApplied(false)
      }
    } catch (error) {
      setPromoError("Failed to validate promo code")
      setPromoDiscount(0)
      setPromoApplied(false)
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const discountAmount = (totalPrice * promoDiscount) / 100
  const finalPrice = totalPrice - discountAmount

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  if (!isOpen) return null

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Симуляция обработки платежа
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Вывод информации о заказе в консоль
    console.log("🎉 НОВЫЙ ЗАКАЗ ОФОРМЛЕН!")
    console.log("=" * 50)
    console.log("📦 ТОВАРЫ:")
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`)
      console.log(`   Количество: ${item.quantity}`)
      console.log(`   Цена за штуку: $${item.price}`)
      console.log(`   Общая стоимость: $${(item.price * item.quantity).toFixed(2)}`)
      console.log("---")
    })

    console.log("💰 ИТОГО К ОПЛАТЕ: $" + totalPrice.toFixed(2))
    console.log("")
    console.log("🚚 АДРЕС ДОСТАВКИ:")
    console.log(`Имя: ${shippingData.firstName} ${shippingData.lastName}`)
    console.log(`Email: ${shippingData.email}`)
    console.log(`Телефон: ${shippingData.phone}`)
    console.log(`Адрес: ${shippingData.address}`)
    console.log(`Город: ${shippingData.city}`)
    console.log(`Индекс: ${shippingData.postalCode}`)
    console.log(`Страна: ${shippingData.country}`)
    console.log("")
    console.log("💳 ПЛАТЕЖНЫЕ ДАННЫЕ:")
    console.log(`Карта: **** **** **** ${paymentData.cardNumber.slice(-4)}`)
    console.log(`Владелец: ${paymentData.cardName}`)
    console.log("")
    console.log("✅ Заказ успешно оформлен!")
    console.log("📧 Письмо с подтверждением отправлено на " + shippingData.email)

    setStep(3)
    clearCart()
    setIsProcessing(false)
  }

  const resetAndClose = () => {
    setStep(1)
    setShippingData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    })
    setPaymentData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={resetAndClose} />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto bg-background border rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{t("checkout.title")}</h2>
          <Button variant="ghost" size="icon" onClick={resetAndClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <Truck className="h-4 w-4" />
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                ✓
              </div>
            </div>
          </div>

          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("checkout.shippingInfo")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t("checkout.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={shippingData.firstName}
                    onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t("checkout.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={shippingData.lastName}
                    onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{t("checkout.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("checkout.phone")}</Label>
                <Input
                  id="phone"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">{t("checkout.address")}</Label>
                <Input
                  id="address"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">{t("checkout.city")}</Label>
                  <Input
                    id="city"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">{t("checkout.postalCode")}</Label>
                  <Input
                    id="postalCode"
                    value={shippingData.postalCode}
                    onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">{t("checkout.country")}</Label>
                  <Input
                    id="country"
                    value={shippingData.country}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {t("checkout.continueToPayment")}
              </Button>
            </form>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t("checkout.paymentInfo")}
              </h3>

              <div>
                <Label htmlFor="cardName">{t("checkout.cardName")}</Label>
                <Input
                  id="cardName"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">{t("checkout.expiryDate")}</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">{t("checkout.cvv")}</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mt-6">
                <h4 className="font-medium mb-2">{t("checkout.orderSummary")}</h4>
                {/* Promo Code Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder={t("checkout.promoCode")}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={promoApplied}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={validatePromoCode}
                      disabled={isValidatingPromo || promoApplied || !promoCode.trim()}
                    >
                      {isValidatingPromo ? "..." : promoApplied ? "✓" : t("checkout.apply")}
                    </Button>
                  </div>
                  {promoError && <p className="text-sm text-red-500">{promoError}</p>}
                  {promoApplied && (
                    <p className="text-sm text-green-600">
                      {t("checkout.promoApplied")} {promoDiscount}% {t("checkout.discount")}
                    </p>
                  )}
                </div>

                {/* Updated totals */}
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>{t("checkout.subtotal")}</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          {t("checkout.discount")} ({promoDiscount}%)
                        </span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 font-medium flex justify-between">
                      <span>{t("checkout.total")}</span>
                      <span>${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {t("checkout.back")}
                </Button>
                <Button type="submit" className="flex-1" disabled={isProcessing}>
                  {isProcessing ? t("checkout.processing") : t("checkout.placeOrder")}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-green-600">{t("checkout.success")}</h3>
              <p className="text-muted-foreground">{t("checkout.successMessage")}</p>
              <p className="text-sm text-muted-foreground">{t("checkout.consoleMessage")}</p>
              <Button onClick={resetAndClose} className="w-full">
                {t("checkout.continueShopping")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
