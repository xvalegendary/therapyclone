import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET environment variable is not set!')
}


export async function encrypt(payload: object): Promise<string> {
	if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export async function decrypt(token: string): Promise<jwt.JwtPayload | null> {
	if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
	try {
		return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
	} catch (error) {
		console.error('Error decrypting token:', error)
		return null
	}
}


export async function loginUser(email: string, password: string) {
	try {

    console.warn('[~] Searching for user:', email)
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)

		if (!user) {
      console.warn('[-] User not found')
			return { success: false, error: 'Invalid credentials' }
		}

	
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) {
			return { success: false, error: 'Invalid credentials' }
		}

	
		const token = await encrypt({
			userId: user.id,
			email: user.email,
			role: user.role,
		})

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
		console.error('Login error:', error)
		return { success: false, error: 'Login failed' }
	}
}

// Регистрация пользователя
export async function register(userData: {
	email: string
	password: string
	name: string
	username: string
	avatar?: string
}) {
	try {
		const { email, password, name, username, avatar = '' } = userData

		const [existingByEmail] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)

		const [existingByUsername] = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1)

		if (existingByEmail) {
			return { success: false, error: 'Email already exists' }
		}
		if (existingByUsername) {
			return { success: false, error: 'Username already exists' }
		}

		const hashedPassword = await bcrypt.hash(password, 12)
		const userId = uuidv4()

		await db.insert(users).values({
			id: userId,
			username,
			email,
			password: hashedPassword,
			name,
			role: 'user',
			avatar,
			isVerified: false,
			createdAt: new Date().toISOString(),
		})

		const token = await encrypt({
			userId,
			email,
			role: 'user',
		})

		return {
			success: true,
			user: {
				id: userId,
				email,
				name,
				role: 'user',
			},
			token,
		}
	} catch (error) {
		console.error('Registration error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Registration failed',
		}
	}
}

export async function logout() {
	 const cookieStore = await cookies() // Await the cookies
		cookieStore.delete('token')
		return { success: true }
}

export async function getSession() {
	const cookieStore = await cookies() // Await the cookies
	const token = cookieStore.get('token')?.value
	if (!token) return null
	return await decrypt(token)
}

export async function updateSession(request: NextRequest) {
	const cookieStore = await request.cookies // Await the cookies
	const token = cookieStore.get('token')?.value
	if (!token) return

	try {
		const payload = await decrypt(token)
		if (!payload) throw new Error('Invalid token')

		const response = NextResponse.next()
		response.cookies.set({
			name: 'token',
			value: await encrypt(payload),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		})
		return response
	} catch (error) {
		console.error('Session update error:', error)
		return NextResponse.redirect(new URL('/login', request.url))
	}
}

// Дополнительные функции
export async function getUserByToken(token: string) {
	try {
		const payload = await decrypt(token)
		if (!payload?.email) return null

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, payload.email))
			.limit(1)
		return user || null
	} catch (error) {
		console.error('Get user by token error:', error)
		return null
	}
}

export async function changePassword(
	userId: string,
	currentPassword: string,
	newPassword: string
) {
	try {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1)
		if (!user) return { success: false, error: 'User not found' }

		const passwordMatch = await bcrypt.compare(currentPassword, user.password)
		if (!passwordMatch)
			return { success: false, error: 'Invalid current password' }

		const hashedPassword = await bcrypt.hash(newPassword, 12)
		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, userId))

		return { success: true }
	} catch (error) {
		console.error('Password change error:', error)
		return { success: false, error: 'Password change failed' }
	}
}

export async function verifyToken(token: string) {
	try {
		const decoded = await decrypt(token)
		return decoded
			? { success: true, user: decoded }
			: { success: false, error: 'Invalid token' }
	} catch (error) {
		return { success: false, error: 'Token verification failed' }
	}
}
