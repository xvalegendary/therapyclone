import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
      },
    })
  } catch (error) {
    console.error("Error in session route:", error)
    return NextResponse.json({ user: null })
  }
}
