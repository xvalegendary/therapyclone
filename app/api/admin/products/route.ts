import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const allProducts = await db.select().from(products)
    return NextResponse.json({ products: allProducts })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price_usd, price_rub, image, category, in_stock } = body

    
    if (!name || price_usd === undefined || price_rub === undefined) {
      return NextResponse.json(
        { error: "Missing required fields (name, price_usd, price_rub)" },
        { status: 400 }
      )
    }

  
    const priceUSD = Math.round(Number(price_usd) * 100)
    const priceRUB = Math.round(Number(price_rub) * 100)

    const productData = {
      id: uuidv4(),
      name,
      description: description || null,
      price: priceRUB, 
      price_usd: priceUSD,
      price_rub: priceRUB,
      image: image || null,
      category: category || "regular",
      in_stock: in_stock !== false,
      created_at: new Date().toISOString()
    }

    await db.insert(products).values(productData)

    return NextResponse.json({ 
      success: true, 
      product: {
        id: productData.id,
        name: productData.name,
        price: productData.price / 100,
        price_usd: productData.price_usd / 100,
        price_rub: productData.price_rub / 100
      }
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}