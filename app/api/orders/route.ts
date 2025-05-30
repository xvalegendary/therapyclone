import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders, orderItems, products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

    // Если токен не найден в заголовке, пробуем получить его из куки
    if (!token) {
      const cookieToken = cookies().get("auth_token")?.value

      if (!cookieToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      }

      try {
        // Получаем пользователя по токену из куки
        const user = await getUserByToken(cookieToken)

        if (!user) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        // Получаем заказы пользователя
        const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(orders.createdAt)

        // Для каждого заказа получаем его элементы
        const ordersWithItems = await Promise.all(
          userOrders.map(async (order) => {
            const items = await db
              .select({
                id: orderItems.id,
                quantity: orderItems.quantity,
                price: orderItems.price,
                productId: products.id,
                productName: products.name,
                productImage: products.image1,
              })
              .from(orderItems)
              .innerJoin(products, eq(orderItems.productId, products.id))
              .where(eq(orderItems.orderId, order.id))

            return {
              ...order,
              items,
            }
          }),
        )

        return NextResponse.json({ orders: ordersWithItems })
      } catch (error: any) {
        // Проверяем, является ли ошибка TokenExpiredError
        if (error.message === "TokenExpiredError") {
          // Удаляем куки с токеном
          cookies().delete("auth_token")

          return NextResponse.json({ error: "Token expired" }, { status: 401 })
        }
        throw error
      }
    }

    try {
      // Получаем пользователя по токену из заголовка
      const user = await getUserByToken(token)

      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Получаем заказы пользователя
      const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(orders.createdAt)

      // Для каждого заказа получаем его элементы
      const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => {
          const items = await db
            .select({
              id: orderItems.id,
              quantity: orderItems.quantity,
              price: orderItems.price,
              productId: products.id,
              productName: products.name,
              productImage: products.image1,
            })
            .from(orderItems)
            .innerJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, order.id))

          return {
            ...order,
            items,
          }
        }),
      )

      return NextResponse.json({ orders: ordersWithItems })
    } catch (error: any) {
      // Проверяем, является ли ошибка TokenExpiredError
      if (error.message === "TokenExpiredError") {
        // Удаляем куки с токеном
        cookies().delete("auth_token")

        return NextResponse.json({ error: "Token expired" }, { status: 401 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error in orders route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
