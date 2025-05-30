import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let query = db.select().from(products)

    // Фильтрация по категории
    if (category && category !== "all") {
      query = query.where(eq(products.category, category))
    }

    const productList = await query

    // Фильтрация по поиску (если есть)
    let filteredProducts = productList
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = productList.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) || product.description?.toLowerCase().includes(searchLower),
      )
    }

    // Преобразуем цены из центов в доллары для фронтенда
    const formattedProducts = filteredProducts.map((product) => ({
      ...product,
      price: product.price / 100,
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error("Error in products route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
