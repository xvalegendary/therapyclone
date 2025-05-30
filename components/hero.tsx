"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function Hero() {
  const { t } = useLanguage()

  const scrollToProducts = () => {
    const element = document.getElementById("products")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="w-full py-24 md:py-32 lg:py-40">
      <div className="container px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t("banner.title")}
              <span className="block">{t("banner.subtitle")}</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">{t("banner.description")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={scrollToProducts} className="text-base px-8">
              {t("banner.shop")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              {t("banner.learnMore")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
