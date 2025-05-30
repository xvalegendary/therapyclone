import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("API: Login route called")

    const body = await request.json()
    const { email, password } = body

    console.log("API: Received login request for:", email)

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Простая проверка для демо
    if (email === "admin@admin.cc" && password === "admin1234") {
      return NextResponse.json({
        success: true,
        token: "demo-admin-token",
        user: {
          id: "admin-id",
          name: "Admin User",
          email: "admin@admin.cc",
          role: "admin",
        },
      })
    }

    if (email === "test@example.com" && password === "password123") {
      return NextResponse.json({
        success: true,
        token: "demo-user-token",
        user: {
          id: "user-id",
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("API: Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
