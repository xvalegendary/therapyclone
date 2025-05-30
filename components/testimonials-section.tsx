"use client"

import { Star } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function TestimonialsSection() {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: "Alex Johnson",
      rating: 5,
      comment: t("reviews.review1"),
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Sarah Chen",
      rating: 5,
      comment: t("reviews.review2"),
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Mike Davis",
      rating: 5,
      comment: t("reviews.review3"),
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <section className="w-full py-24">
      <div className="container px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t("reviews.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("reviews.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-6 space-y-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center space-x-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-muted-foreground">"{testimonial.comment}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{t("reviews.verifiedCustomer")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
