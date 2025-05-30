"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/admin/image-upload"
import { X } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price_usd: number
  price_rub: number
  image: string
  category: string
  in_stock: boolean
}

interface ProductFormProps {
  product?: Product | null
  onSave: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_usd: "",
    price_rub: "",
    image: "",
    category: "regular",
    in_stock: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price_usd: product.price_usd.toString(),
        price_rub: product.price_rub.toString(),
        image: product.image,
        category: product.category,
        in_stock: product.in_stock,
      })
    }
  }, [product])

  const handlePriceChange = (field: "price_usd" | "price_rub", value: string) => {
    const numValue = Number.parseFloat(value) || 0

    if (field === "price_usd") {
      setFormData((prev) => ({
        ...prev,
        price_usd: value,
        price_rub: (numValue * 90).toFixed(0), // Auto convert USD to RUB
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        price_rub: value,
        price_usd: (numValue / 90).toFixed(2), // Auto convert RUB to USD
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price_usd: Number.parseFloat(formData.price_usd),
          price_rub: Number.parseFloat(formData.price_rub),
          image: formData.image,
          category: formData.category,
          in_stock: formData.in_stock,
        }),
      })

      if (response.ok) {
        onSave()
      } else {
        alert("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
            <CardDescription>
              {product ? "Update product details" : "Create a new product for your store"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_usd">Price (USD)</Label>
                <Input
                  id="price_usd"
                  type="number"
                  step="0.01"
                  value={formData.price_usd}
                  onChange={(e) => handlePriceChange("price_usd", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_rub">Price (RUB)</Label>
                <Input
                  id="price_rub"
                  type="number"
                  step="1"
                  value={formData.price_rub}
                  onChange={(e) => handlePriceChange("price_rub", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="new-arrival">New Arrival</SelectItem>
                  <SelectItem value="best-seller">Best Seller</SelectItem>
                  <SelectItem value="limited-edition">Limited Edition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, in_stock: checked }))}
              />
              <Label htmlFor="in_stock">In Stock</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
