import { type NextRequest, NextResponse } from 'next/server'
import { register } from '@/lib/auth'

export async function POST(request: NextRequest) {
	try {
		const contentType = request.headers.get('content-type')

		
		if (contentType !== 'application/json') {
			return NextResponse.json(
				{
					success: false,
					error: 'Unsupported Content-Type. Please use application/json',
				},
				{ status: 415 }
			)
		}

		const data = await request.json()

		if (!data.email || !data.password || !data.name || !data.username) {
			return NextResponse.json(
				{
					success: false,
					error: 'Missing required fields (email, password, name, username)',
				},
				{ status: 400 }
			)
		}

		// Проверка имени
		if (!/^[a-zA-Zа-яА-Я\s]+$/.test(data.name)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Name should only contain letters and spaces',
				},
				{ status: 400 }
			)
		}

		// Проверка username (пример: только латиница, цифры и _)
		if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
			return NextResponse.json(
				{
					success: false,
					error:
						'Username should contain only letters, numbers and underscores',
				},
				{ status: 400 }
			)
		}

	
		const passwordStrength = calculatePasswordStrength(data.password)
		if (passwordStrength < 40) {
			return NextResponse.json(
				{
					success: false,
					error: 'Password too weak',
					details:
						'Password must be at least medium strength (include uppercase, lowercase letters and numbers)',
				},
				{ status: 400 }
			)
		}

		const result = await register(data)

		if (!result.success) {
			return NextResponse.json(
				{ success: false, error: result.error },
				{ status: 400 }
			)
		}

		return NextResponse.json({
			success: true,
			user: result.user,
			message: 'Registration successful',
		})
	} catch (error) {
		console.error('Error in register route:', error)
		return NextResponse.json(
			{ success: false, error: 'An error occurred during registration' },
			{ status: 500 }
		)
	}
}

function calculatePasswordStrength(password: string): number {
	if (!password) return 0

	let strength = 0
	const length = password.length

	if (length >= 8) strength += 25
	if (length >= 12) strength += 15
	if (/[A-Z]/.test(password)) strength += 20
	if (/[a-z]/.test(password)) strength += 20
	if (/\d/.test(password)) strength += 20
	if (/[^A-Za-z0-9]/.test(password)) strength += 20

	return Math.min(strength, 100)
}
