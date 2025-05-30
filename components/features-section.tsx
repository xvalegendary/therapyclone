"use client"

import { Truck, Shield, Headphones, RotateCcw } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Truck,
      title: t("features.freeShipping"),
      description: t("features.freeShippingDesc"),
    },
    {
      icon: Shield,
      title: t("features.securePurchase"),
      description: t("features.securePurchaseDesc"),
    },
    {
      icon: Headphones,
      title: t("features.support247"),
      description: t("features.support247Desc"),
    },
    {
      icon: RotateCcw,
      title: t("features.freeReturns"),
      description: t("features.freeReturnsDesc"),
    },
  ]

  return (
    <section className="w-full py-24 bg-muted/30">
      <div className="container px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t("features.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mx-auto w-12 h-12 bg-foreground text-background rounded-lg flex items-center justify-center">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
