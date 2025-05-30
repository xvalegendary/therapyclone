import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, verificationCodes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    // Поиск кода верификации
    const verificationRecord = await db
      .select()
      .from(verificationCodes)
      .where(and(eq(verificationCodes.email, email), eq(verificationCodes.code, code)))
      .limit(1)

    if (verificationRecord.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    const verification = verificationRecord[0]

    // Проверка срока действия
    if (new Date() > new Date(verification.expiresAt)) {
      // Удаляем просроченный код
      await db.delete(verificationCodes).where(eq(verificationCodes.id, verification.id))
      return NextResponse.json({ success: false, error: "Verification code has expired" }, { status: 400 })
    }

    // Активация пользователя
    await db.update(users).set({ isVerified: true }).where(eq(users.id, verification.userId))

    // Удаление использованного кода
    await db.delete(verificationCodes).where(eq(verificationCodes.id, verification.id))

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during verification",
      },
      { status: 500 },
    )
  }
}
