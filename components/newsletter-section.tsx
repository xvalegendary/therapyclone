"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function NewsletterSection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="w-full py-24 bg-muted/30">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Mail className="h-12 w-12 mx-auto text-foreground" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("newsletter.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("newsletter.subtitle")}</p>
          </div>

          {isSubscribed ? (
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-lg font-medium text-foreground">{t("newsletter.success")}</p>
              <p className="text-muted-foreground">{t("newsletter.successMessage")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background text-foreground border-border"
                required
              />
              <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
                {t("newsletter.subscribe")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
