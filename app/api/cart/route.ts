import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Импортируем функцию для получения пользователя по токену
import { getUserByToken } from "@/lib/auth"

// Интерфейс для элемента корзины
interface CartItem {
  id: string
  quantity: number
}

// Получение корзины из куки
async function getCart(): Promise<CartItem[]> {
  try {
    const cartCookie = cookies().get("cart")?.value
    return cartCookie ? JSON.parse(cartCookie) : []
  } catch (error) {
    console.error("Error parsing cart cookie:", error)
    return []
  }
}

// Сохранение корзины в куки
async function saveCart(cart: CartItem[]) {
  cookies().set({
    name: "cart",
    value: JSON.stringify(cart),
    maxAge: 60 * 60 * 24 * 7, // 1 неделя
    path: "/",
  })
}

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

      // Получаем пользователя по токену
      const user = await getUserByToken(cookieToken)
      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Получаем корзину из куки для неавторизованного пользователя
      const cartItems = await getCart()

      // Здесь можно добавить логику для объединения корзины из куки с корзиной пользователя в БД

      return NextResponse.json({ items: cartItems })
    }

    // Получаем пользователя по токену
    const user = await getUserByToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Получаем корзину из куки
    const cartItems = await getCart()

    // Здесь можно добавить логику для получения корзины пользователя из БД

    return NextResponse.json({ items: cartItems })
  } catch (error) {
    console.error("Error in cart route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json()

    // Получаем текущую корзину
    const cart = await getCart()

    // Проверяем, есть ли товар уже в корзине
    const existingItemIndex = cart.findIndex((item) => item.id === productId)

    if (existingItemIndex >= 0) {
      // Обновляем количество
      cart[existingItemIndex].quantity += quantity
    } else {
      // Добавляем новый товар
      cart.push({ id: productId, quantity })
    }

    // Сохраняем корзину
    await saveCart(cart)

    return NextResponse.json({ message: "Product added to cart" })
  } catch (error) {
    console.error("Error in cart route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { productId, quantity } = await request.json()

    // Получаем текущую корзину
    const cart = await getCart()

    // Находим товар в корзине
    const existingItemIndex = cart.findIndex((item) => item.id === productId)

    if (existingItemIndex >= 0) {
      if (quantity <= 0) {
        // Удаляем товар из корзины
        cart.splice(existingItemIndex, 1)
      } else {
        // Обновляем количество
        cart[existingItemIndex].quantity = quantity
      }

      // Сохраняем корзину
      await saveCart(cart)

      return NextResponse.json({ message: "Cart updated" })
    } else {
      return NextResponse.json({ error: "Product not found in cart" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error in cart route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { productId } = await request.json()

    // Получаем текущую корзину
    const cart = await getCart()

    // Удаляем товар из корзины
    const newCart = cart.filter((item) => item.id !== productId)

    // Сохраняем корзину
    await saveCart(newCart)

    return NextResponse.json({ message: "Product removed from cart" })
  } catch (error) {
    console.error("Error in cart route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
