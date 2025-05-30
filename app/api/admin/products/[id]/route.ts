import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, price_usd, price_rub, image, category, in_stock } = body

    if (!name || !description || !price_usd || !price_rub) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await db
      .update(products)
      .set({
        name,
        description,
        price_usd: Number.parseFloat(price_usd),
        price_rub: Number.parseFloat(price_rub),
        image: image || "/placeholder.svg?height=400&width=400",
        category: category || "regular",
        in_stock: in_stock !== false,
      })
      .where(eq(products.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(products).where(eq(products.id, params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
