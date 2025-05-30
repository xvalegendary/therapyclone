"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price_usd: number
  price_rub: number
  image: string
  category: string
  in_stock: boolean
  created_at: string
}

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "new-arrival":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "best-seller":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "limited-edition":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products found. Add your first product!</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Price (RUB)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg?height=48&width=48"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">{product.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(product.category)}>{product.category.replace("-", " ")}</Badge>
              </TableCell>
              <TableCell>${product.price_usd}</TableCell>
              <TableCell>₽{product.price_rub}</TableCell>
              <TableCell>
                <Badge variant={product.in_stock ? "default" : "secondary"}>
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
