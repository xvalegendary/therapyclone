"use client"

import { ProductCard } from "@/components/product-card"
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

interface ProductGridProps {
  products: Product[]
  loading: boolean
  isAdmin: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductGrid({ products, loading, isAdmin, onEdit, onDelete }: ProductGridProps) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <section id="products" className="w-full py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("products.latestCollection")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("products.collectionDescription")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="w-full py-24">
      <div className="container px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("products.latestCollection")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("products.collectionDescription")}</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t("products.noProducts")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
