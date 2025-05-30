import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Простая проверка токена для демо
    if (token === "demo-admin-token") {
      return NextResponse.json({
        user: {
          id: "admin-id",
          name: "Admin User",
          email: "admin@admin.cc",
          role: "admin",
        },
      })
    }

    if (token === "demo-user-token") {
      return NextResponse.json({
        user: {
          id: "user-id",
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
      })
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
