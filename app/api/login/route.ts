import { NextResponse } from "next/server"
import { loginUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
		console.log('[~] API: Login route called')

		const body = await request.json()
		const { email, password } = body

		if (!email || !password) {
			return NextResponse.json(
				{ success: false, error: 'Email and password are required' },
				{ status: 400 }
			)
		}
    console.warn('[~] API: Received login request for:', email)

		const result = await loginUser(email, password)

		if (!result.success) {
			return NextResponse.json(
				{ success: false, error: result.error },
				{ status: 401 }
			)
		}

		return NextResponse.json({
			success: true,
			token: result.token,
			user: result.user,
		})
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json(
			{ success: false, error: 'Server error' },
			{ status: 500 }
		)
	}
  
}
