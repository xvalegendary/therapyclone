import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    console.log("Fetching products...")
    const allProducts = await db.select().from(products)
    console.log("Products fetched:", allProducts.length)
    return NextResponse.json({ products: allProducts })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Creating new product...")
    const body = await request.json()
    console.log("Request body:", body)

    const { name, description, price_usd, price_rub, image, category, in_stock } = body

    if (!name || !description || price_usd === undefined || price_rub === undefined) {
      console.log("Missing required fields:", { name, description, price_usd, price_rub })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const productId = uuidv4()
    console.log("Generated product ID:", productId)

    const productData = {
      id: productId,
      name,
      description,
      priceUSD: Math.round(Number.parseFloat(price_usd.toString()) * 100), 
      priceRUB: Math.round(Number.parseFloat(price_rub.toString()) * 100), 
      image1: image || "/placeholder.svg?height=400&width=400",
      image2: null,
      category: category || "regular",
      featured: false,
      inStock: in_stock !== false,
      createdAt: new Date().toISOString(),
    }

    console.log("Inserting product data:", productData)

    await db.insert(products).values(productData)

    console.log("Product created successfully")
    return NextResponse.json({ success: true, id: productId })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
