import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByToken } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Получаем токен из куки
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Получаем пользователя по токену
    const user = await getUserByToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // В нашей имитации просто возвращаем фиктивный заказ
    const order = {
      id: orderId,
      userId: user.id,
      totalAmount: 149.99,
      status: "pending",
      createdAt: new Date().toISOString(),
      items: [
        {
          id: "item-1",
          productId: "product-1",
          quantity: 1,
          price: 149.99,
          product: {
            id: "product-1",
            name: "SDFM Classic Black",
            price: 149.99,
            image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
          },
        },
      ],
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in order details route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
