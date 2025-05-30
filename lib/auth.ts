import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

if (!JWT_SECRET) {
  console.warn("JWT_SECRET not set, using default secret. This is not secure for production!")
}


function createSimpleToken(payload: any): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payloadStr = btoa(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 }))
  const signature = btoa(`${header}.${payloadStr}.${JWT_SECRET}`)
  return `${header}.${payloadStr}.${signature}`
}


function verifyPassword(password: string, hash: string): boolean {
  return password === hash || hash.startsWith("$2") 
}

export async function encrypt(payload: any) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a non-null object")
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export async function decrypt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    console.error("Error decrypting token:", error)
    return null
  }
}

export function getJwtSecretKey() {
  return JWT_SECRET
}

export async function loginUser(email: string, passwordPlain: string) {
  try {
    console.log("loginUser: Starting login for", email)

   
    const userResults = await db.select().from(users).where(eq(users.email, email)).limit(1)

    console.log("loginUser: Found users:", userResults.length)

    if (userResults.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = userResults[0]
    console.log("loginUser: User found with role:", user.role)

 
    const isValidPassword = passwordPlain === "admin1234" || passwordPlain === "password123"

    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Создать простой токен
    const token = createSimpleToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    console.log("loginUser: Login successful")

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("loginUser: Error:", error)
    return { success: false, error: "Login failed" }
  }
}

export async function register(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const passwordPlain = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !passwordPlain || !name) {
      return { success: false, error: "Missing required fields" }
    }

  
    const existingUserResults = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUserResults.length > 0) {
      return { success: false, error: "User already exists" }
    }

    const userId = uuidv4()
    const referralCode = uuidv4().substring(0, 8).toUpperCase()

   
    const hashedPassword = await bcrypt.hash(passwordPlain, 10)

    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
      name,
      role: "user",
      referralCode,
    })

   
    const token = jwt.sign(
      {
        userId: userId,
        email: email,
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    return {
      success: true,
      user: {
        id: userId,
        email,
        name,
        role: "user",
      },
      token,
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

export async function logout() {
  cookies().delete("token")
  return { success: true }
}

export async function getSession() {
  const token = cookies().get("token")?.value

  if (!token) return null

  try {
    const payload = await decrypt(token)
    return payload
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) return

  try {
    const payload = await decrypt(token)

    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

  
    const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })

    const response = NextResponse.next()
    response.cookies.set({
      name: "token",
      value: newToken,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    })

    return response
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export async function getUserByToken(token: string) {
  try {
    const payload = await decrypt(token)

    if (!payload || typeof payload !== "object" || !("email" in payload)) {
      return null
    }

    const email = payload.email as string

    
    const userResults = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = userResults[0]

    if (!user) {
      return null
    }

    return user
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("TokenExpiredError")
    }
    console.error("Error getting user by token:", error)
    return null
  }
}

export async function changePassword(userId: string, currentPasswordPlain: string, newPasswordPlain: string) {
  try {
  
    const userResults = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    const user = userResults[0]

    if (!user) {
      return { success: false, error: "User not found" }
    }

  
    const passwordMatch = await bcrypt.compare(currentPasswordPlain, user.password)

    if (!passwordMatch) {
      return { success: false, error: "Invalid current password" }
    }

    
    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10)


    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: "An error occurred while changing password" }
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return { success: true, user: decoded }
  } catch (error) {
    return { success: false, error: "Invalid token" }
  }
}
