import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Удаляем куки с токеном
  cookies().delete("auth_token")

  return NextResponse.json({ message: "Logged out successfully" })
}
