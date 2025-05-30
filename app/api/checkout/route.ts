import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders, orderItems, products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"


interface CartItem {
  id: string
  quantity: number
}


async function getCart(): Promise<CartItem[]> {
  try {
    const cartCookie = cookies().get("cart")?.value
    return cartCookie ? JSON.parse(cartCookie) : []
  } catch (error) {
    console.error("Error parsing cart cookie:", error)
    return []
  }
}


async function clearCart() {
  cookies().set({
    name: "cart",
    value: "[]",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/",
  })
}

export async function POST(request: Request) {
  try {
    const { shippingAddress } = await request.json()


    const cookieToken = cookies().get("auth_token")?.value

    if (!cookieToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

  
    const user = await getUserByToken(cookieToken)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

  
    const cartItems = await getCart()

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

   
    const productIds = cartItems.map((item) => item.id)
    const productsData = await db.select().from(products).where(eq(products.id, productIds[0])) 

    if (productsData.length === 0) {
      return NextResponse.json({ error: "Products not found" }, { status: 400 })
    }

 
    let totalAmount = 0
    for (const item of cartItems) {
      const product = productsData.find((p) => p.id === item.id)
      if (product) {
        totalAmount += product.price * item.quantity
      }
    }

   
    const orderId = uuidv4()
    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    
    for (const item of cartItems) {
      const product = productsData.find((p) => p.id === item.id)
      if (product) {
        await db.insert(orderItems).values({
          id: uuidv4(),
          orderId,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        })
      }
    }


    await clearCart()

    return NextResponse.json({
      message: "Order created successfully",
      orderId,
    })
  } catch (error) {
    console.error("Error in checkout route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
