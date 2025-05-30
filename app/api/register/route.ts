import { type NextRequest, NextResponse } from "next/server"
import { register } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Проверяем наличие всех необходимых полей
    const email = formData.get("email")
    const password = formData.get("password")
    const name = formData.get("name")

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await register(formData)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: result.user })
  } catch (error) {
    console.error("Error in register route:", error)
    return NextResponse.json({ success: false, error: "An error occurred during registration" }, { status: 500 })
  }
}
