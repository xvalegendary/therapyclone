import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { promoCodes } from "@/lib/db/schema"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const cookieToken = cookies().get("auth_token")?.value

    if (!cookieToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserByToken(cookieToken)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const codes = await db.select().from(promoCodes).orderBy(promoCodes.createdAt)

    return NextResponse.json({ promoCodes: codes })
  } catch (error) {
    console.error("Error fetching promo codes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieToken = cookies().get("auth_token")?.value

    if (!cookieToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserByToken(cookieToken)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { code, discount, expiresAt, usageLimit } = await request.json()

    if (!code || !discount) {
      return NextResponse.json({ error: "Code and discount are required" }, { status: 400 })
    }

    const promoId = uuidv4()

    await db.insert(promoCodes).values({
      id: promoId,
      code: code.toUpperCase(),
      discount: Number.parseFloat(discount),
      expiresAt: expiresAt || null,
      usageLimit: usageLimit ? Number.parseInt(usageLimit) : null,
      usageCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "Promo code created successfully" })
  } catch (error) {
    console.error("Error creating promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
