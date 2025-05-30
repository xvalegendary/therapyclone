"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleEdit = (id: string) => {
    console.log("Edit product:", id)
  }

  const handleDelete = (id: string) => {
    console.log("Delete product:", id)
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <ProductGrid
        products={products}
        loading={loading}
        isAdmin={user?.role === "admin"}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
