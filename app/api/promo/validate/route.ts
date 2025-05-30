import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { promoCodes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    // Найти промокод
    const promoCode = await db
      .select()
      .from(promoCodes)
      .where(and(eq(promoCodes.code, code.toUpperCase()), eq(promoCodes.isActive, true)))
      .limit(1)

    if (promoCode.length === 0) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 })
    }

    const promo = promoCode[0]

    // Проверить срок действия
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Promo code has expired" }, { status: 400 })
    }

    // Проверить лимит использования
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      discount: promo.discount,
      code: promo.code,
    })
  } catch (error) {
    console.error("Error validating promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
