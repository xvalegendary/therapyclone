import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate file upload - in production, upload to cloud storage
    const timestamp = Date.now()
    const fileName = `avatar_${timestamp}_${file.name}`

    // For demo, create a unique placeholder URL
    const avatarUrl = `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(fileName.slice(0, 2).toUpperCase())}&bg=6366f1&color=white`

    console.log("Avatar uploaded:", fileName, "->", avatarUrl)

    return NextResponse.json({
      success: true,
      url: avatarUrl,
      fileName: fileName,
      message: "Avatar uploaded successfully",
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
}
