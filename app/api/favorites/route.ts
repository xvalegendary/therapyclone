import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { userFavorites, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
	try {

		const authHeader = request.headers.get('Authorization')
		const token = authHeader?.startsWith('Bearer ')
			? authHeader.substring(7)
			: null

	
		if (!token) {
			const cookieStore = cookies()
			const cookieToken = cookieStore.get('auth_token')?.value

			if (!cookieToken) {
				return NextResponse.json(
					{ error: 'Not authenticated' },
					{ status: 401 }
				)
			}

			try {
			
				const user = await getUserByToken(cookieToken)

				if (!user) {
					return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
				}

			
				const favorites = await db
					.select({
						id: products.id,
						name: products.name,
						price: products.price_rub,
						price2: products.price_usd,
						image: products.image,
					})
					.from(userFavorites)
					.innerJoin(products, eq(userFavorites.product_id, products.id))
					.where(eq(userFavorites.user_id, user.id))

				return NextResponse.json({ favorites })
			} catch (error: any) {
				if (error.message === 'TokenExpiredError') {
					const cookieStore = cookies()
					cookieStore.delete('auth_token')
					return NextResponse.json({ error: 'Token expired' }, { status: 401 })
				}
				throw error
			}
		}

		try {
			const user = await getUserByToken(token)
			if (!user) {
				return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
			}

			const favorites = await db
				.select({
					id: products.id,
					name: products.name,
					price: products.price_rub,
          price2: products.price_usd,
					image: products.image,
				})
				.from(userFavorites)
				.innerJoin(products, eq(userFavorites.product_id, products.id))
				.where(eq(userFavorites.user_id, user.id))

			return NextResponse.json({ favorites })
		} catch (error: any) {
			if (error.message === 'TokenExpiredError') {
				const cookieStore = cookies()
				cookieStore.delete('auth_token')
				return NextResponse.json({ error: 'Token expired' }, { status: 401 })
			}
			throw error
		}
	} catch (error) {
		console.error('Error in favorites route:', error)
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		const { productId } = await request.json()

		const authHeader = request.headers.get('Authorization')
		const token = authHeader?.startsWith('Bearer ')
			? authHeader.substring(7)
			: null

		if (!token) {
			const cookieStore = cookies()
			const cookieToken = cookieStore.get('auth_token')?.value

			if (!cookieToken) {
				return NextResponse.json(
					{ error: 'Not authenticated' },
					{ status: 401 }
				)
			}

			try {
				const user = await getUserByToken(cookieToken)
				if (!user) {
					return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
				}

				const existingFavorite = await db
					.select()
					.from(userFavorites)
					.where(
						and(
							eq(userFavorites.user_id, user.id),
							eq(userFavorites.product_id, productId)
						)
					)
					.limit(1)

				if (existingFavorite.length === 0) {
					await db.insert(userFavorites).values({
						user_id: user.id,
						product_id: productId,
						created_at: new Date().toISOString(),
					})
				}

				return NextResponse.json({ message: 'Product added to favorites' })
			} catch (error: any) {
				if (error.message === 'TokenExpiredError') {
					const cookieStore = cookies()
					cookieStore.delete('auth_token')
					return NextResponse.json({ error: 'Token expired' }, { status: 401 })
				}
				throw error
			}
		}

		try {
			const user = await getUserByToken(token)
			if (!user) {
				return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
			}

			const existingFavorite = await db
				.select()
				.from(userFavorites)
				.where(
					and(
						eq(userFavorites.user_id, user.id),
						eq(userFavorites.product_id, productId)
					)
				)
				.limit(1)

			if (existingFavorite.length === 0) {
				await db.insert(userFavorites).values({
					user_id: user.id,
					product_id: productId,
					created_at: new Date().toISOString(),
				})
			}

			return NextResponse.json({ message: 'Product added to favorites' })
		} catch (error: any) {
			if (error.message === 'TokenExpiredError') {
				const cookieStore = cookies()
				cookieStore.delete('auth_token')
				return NextResponse.json({ error: 'Token expired' }, { status: 401 })
			}
			throw error
		}
	} catch (error) {
		console.error('Error in favorites route:', error)
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		)
	}
}

export async function DELETE(request: Request) {
	try {
		const { productId } = await request.json()

		const authHeader = request.headers.get('Authorization')
		const token = authHeader?.startsWith('Bearer ')
			? authHeader.substring(7)
			: null

		if (!token) {
			const cookieStore = cookies()
			const cookieToken = cookieStore.get('auth_token')?.value

			if (!cookieToken) {
				return NextResponse.json(
					{ error: 'Not authenticated' },
					{ status: 401 }
				)
			}

			try {
				const user = await getUserByToken(cookieToken)
				if (!user) {
					return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
				}

				await db
					.delete(userFavorites)
					.where(
						and(
							eq(userFavorites.user_id, user.id),
							eq(userFavorites.product_id, productId)
						)
					)

				return NextResponse.json({ message: 'Product removed from favorites' })
			} catch (error: any) {
				if (error.message === 'TokenExpiredError') {
					const cookieStore = cookies()
					cookieStore.delete('auth_token')
					return NextResponse.json({ error: 'Token expired' }, { status: 401 })
				}
				throw error
			}
		}

		try {
			const user = await getUserByToken(token)
			if (!user) {
				return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
			}

			await db
				.delete(userFavorites)
				.where(
					and(
						eq(userFavorites.user_id, user.id),
						eq(userFavorites.product_id, productId)
					)
				)

			return NextResponse.json({ message: 'Product removed from favorites' })
		} catch (error: any) {
			if (error.message === 'TokenExpiredError') {
				const cookieStore = cookies()
				cookieStore.delete('auth_token')
				return NextResponse.json({ error: 'Token expired' }, { status: 401 })
			}
			throw error
		}
	} catch (error) {
		console.error('Error in favorites route:', error)
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		)
	}
}
