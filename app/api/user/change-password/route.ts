import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByToken, changePassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Получаем данные из запроса
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

    // Если токен не найден в заголовке, пробуем получить его из куки
    if (!token) {
      const cookieStore = cookies()
      const cookieToken = cookieStore.get("auth_token")?.value

      if (!cookieToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      }

      try {
        // Получаем пользователя по токену из куки
        const user = await getUserByToken(cookieToken)

        if (!user) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        // Меняем пароль
        const result = await changePassword(user.id, currentPassword, newPassword)

        if (result.success) {
          return NextResponse.json({ message: "Password changed successfully" })
        } else {
          return NextResponse.json({ error: result.error }, { status: 400 })
        }
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

      // Меняем пароль
      const result = await changePassword(user.id, currentPassword, newPassword)

      if (result.success) {
        return NextResponse.json({ message: "Password changed successfully" })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
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
    console.error("Error in change password route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
