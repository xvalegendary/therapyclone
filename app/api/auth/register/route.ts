import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { users, verificationCodes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { validateUsername, validatePassword, validateEmail } from "@/lib/validation"
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Валидация данных
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.isValid) {
      return NextResponse.json({ success: false, error: usernameValidation.message }, { status: 400 })
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json({ success: false, error: emailValidation.message }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ success: false, error: passwordValidation.message }, { status: 400 })
    }

    // Проверка существования пользователя
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
    }

    const existingUsername = await db.select().from(users).where(eq(users.username, username)).limit(1)
    if (existingUsername.length > 0) {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 400 })
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создание пользователя (неактивированного)
    const userId = uuidv4()
    const referralCode = uuidv4().substring(0, 8).toUpperCase()

    await db.insert(users).values({
      id: userId,
      username,
      email,
      password: hashedPassword,
      name: username,
      role: "user",
      referralCode,
      isVerified: false,
    })

    // Генерация и сохранение кода верификации
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 минут

    await db.insert(verificationCodes).values({
      id: uuidv4(),
      userId,
      email,
      code: verificationCode,
      expiresAt: expiresAt.toISOString(),
    })

    // Отправка email
    const emailResult = await sendVerificationEmail(email, verificationCode, username)

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send verification email. Please try again.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for verification code.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during registration",
      },
      { status: 500 },
    )
  }
}
