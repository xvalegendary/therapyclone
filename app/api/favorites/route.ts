import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { userFavorites, products } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

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

        // Получаем избранные товары пользователя
        const favorites = await db
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
            image: products.image1,
          })
          .from(userFavorites)
          .innerJoin(products, eq(userFavorites.productId, products.id))
          .where(eq(userFavorites.userId, user.id))

        return NextResponse.json({ favorites })
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

      // Получаем избранные товары пользователя
      const favorites = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          image: products.image1,
        })
        .from(userFavorites)
        .innerJoin(products, eq(userFavorites.productId, products.id))
        .where(eq(userFavorites.userId, user.id))

      return NextResponse.json({ favorites })
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
    console.error("Error in favorites route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

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

        // Проверяем, есть ли уже товар в избранном
        const existingFavorite = await db
          .select()
          .from(userFavorites)
          .where(and(eq(userFavorites.userId, user.id), eq(userFavorites.productId, productId)))
          .limit(1)

        if (existingFavorite.length === 0) {
          // Добавляем товар в избранное
          await db.insert(userFavorites).values({
            userId: user.id,
            productId,
          })
        }

        return NextResponse.json({ message: "Product added to favorites" })
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

      // Проверяем, есть ли уже товар в избранном
      const existingFavorite = await db
        .select()
        .from(userFavorites)
        .where(and(eq(userFavorites.userId, user.id), eq(userFavorites.productId, productId)))
        .limit(1)

      if (existingFavorite.length === 0) {
        // Добавляем товар в избранное
        await db.insert(userFavorites).values({
          userId: user.id,
          productId,
        })
      }

      return NextResponse.json({ message: "Product added to favorites" })
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
    console.error("Error in favorites route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { productId } = await request.json()

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

        // Удаляем товар из избранного
        await db
          .delete(userFavorites)
          .where(and(eq(userFavorites.userId, user.id), eq(userFavorites.productId, productId)))

        return NextResponse.json({ message: "Product removed from favorites" })
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

      // Удаляем товар из избранного
      await db
        .delete(userFavorites)
        .where(and(eq(userFavorites.userId, user.id), eq(userFavorites.productId, productId)))

      return NextResponse.json({ message: "Product removed from favorites" })
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
    console.error("Error in favorites route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
