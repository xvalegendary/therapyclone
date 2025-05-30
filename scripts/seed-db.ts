import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { users, products, promoCodes } from '../lib/db/schema'
import bcrypt from 'bcryptjs'

const client = createClient({
	url: 'file:sqlite.db',
})
const db = drizzle(client, { schema: { users, products, promoCodes } })

async function seedDatabase() {
	try {
		console.log('🌱 Seeding database...')

		// Очищаем существующие данные
		console.log('🧹 Clearing existing data...')
		await db.delete(promoCodes)
		await db.delete(products)
		await db.delete(users)

		// Создаем админа
		console.log('👤 Creating admin user...')
		const adminPassword = await bcrypt.hash('admin1234', 10)
		await db.insert(users).values({
			id: 'admin-1',
			username: 'admin',
			name: 'Admin',
			email: 'admin@admin.cc',
			password: adminPassword,
			role: 'admin',
			isVerified: true,
			createdAt: new Date(),
		})

		// Создаем тестового пользователя
		console.log('👤 Creating test user...')
		const userPassword = await bcrypt.hash('password123', 10)
		await db.insert(users).values({
			id: 'user-1',
			username: 'testuser',
			name: 'Test User',
			email: 'test@example.com',
			password: userPassword,
			role: 'user',
			isVerified: true,
			createdAt: new Date(),
		})

		// Добавляем худи
		console.log('👕 Adding hoodies...')
		const hoodies = [
			{
				id: 'hoodie-1',
				name: 'Classic Black Hoodie',
				description:
					'Premium quality black hoodie made from 100% organic cotton',
				price_usd: 89.99,
				price_rub: 8999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'hoodies',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'hoodie-2',
				name: 'White Minimalist Hoodie',
				description: 'Clean white hoodie with minimalist design',
				price_usd: 79.99,
				price_rub: 7999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'hoodies',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'hoodie-3',
				name: 'Gray Oversized Hoodie',
				description: 'Comfortable oversized hoodie in gray',
				price_usd: 94.99,
				price_rub: 9499,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'hoodies',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
			{
				id: 'hoodie-4',
				name: 'Navy Blue Hoodie',
				description: 'Classic navy blue hoodie for everyday wear',
				price_usd: 84.99,
				price_rub: 8499,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'hoodies',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'hoodie-5',
				name: 'Red Sport Hoodie',
				description: 'Athletic red hoodie perfect for workouts',
				price_usd: 99.99,
				price_rub: 9999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'hoodies',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
			{
				id: 'hoodie-6',
				name: 'Green Eco Hoodie',
				description: 'Eco-friendly hoodie made from recycled materials',
				price_usd: 109.99,
				price_rub: 10999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'hoodies',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
		]

		// Добавляем футболки
		console.log('👔 Adding t-shirts...')
		const tshirts = [
			{
				id: 'tshirt-1',
				name: 'Basic White Tee',
				description: 'Essential white t-shirt made from 100% cotton',
				price_usd: 29.99,
				price_rub: 2999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'tees',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
			{
				id: 'tshirt-2',
				name: 'Black Graphic Tee',
				description: 'Stylish black t-shirt with unique graphic design',
				price_usd: 34.99,
				price_rub: 3499,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'tees',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'tshirt-3',
				name: 'Vintage Band Tee',
				description: 'Retro-style band t-shirt with vintage wash',
				price_usd: 39.99,
				price_rub: 3999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'tees',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
		]

		// Добавляем штаны
		console.log('👖 Adding pants...')
		const pants = [
			{
				id: 'pants-1',
				name: 'Black Joggers',
				description: 'Comfortable black joggers perfect for casual wear',
				price_usd: 59.99,
				price_rub: 5999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'pants',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
			{
				id: 'pants-2',
				name: 'Denim Jeans',
				description: 'Classic blue denim jeans with regular fit',
				price_usd: 79.99,
				price_rub: 7999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'pants',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'pants-3',
				name: 'Cargo Pants',
				description: 'Utility cargo pants with multiple pockets',
				price_usd: 69.99,
				price_rub: 6999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'pants',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
		]

		// Добавляем обувь
		console.log('👟 Adding shoes...')
		const shoes = [
			{
				id: 'shoes-1',
				name: 'White Sneakers',
				description: 'Clean white sneakers for everyday style',
				price_usd: 119.99,
				price_rub: 11999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'shoes',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'shoes-2',
				name: 'Black Boots',
				description: 'Durable black boots for all weather conditions',
				price_usd: 149.99,
				price_rub: 14999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'shoes',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
		]

		// Добавляем аксессуары
		console.log('🎒 Adding accessories...')
		const accessories = [
			{
				id: 'acc-1',
				name: 'Baseball Cap',
				description: 'Classic baseball cap with adjustable strap',
				price_usd: 24.99,
				price_rub: 2499,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'accessories',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
			{
				id: 'acc-2',
				name: 'Leather Wallet',
				description: 'Premium leather wallet with multiple card slots',
				price_usd: 49.99,
				price_rub: 4999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'accessories',
				in_stock: true,
				featured: true,
				created_at: new Date(),
			},
			{
				id: 'acc-3',
				name: 'Canvas Backpack',
				description: 'Durable canvas backpack for daily use',
				price_usd: 79.99,
				price_rub: 7999,
				image1: '/placeholder.svg?height=400&width=400',
				image2: '/placeholder.svg?height=400&width=400',
				category: 'accessories',
				in_stock: true,
				featured: false,
				created_at: new Date(),
			},
		]

		// Вставляем все товары
		const allProducts = [
			...hoodies,
			...tshirts,
			...pants,
			...shoes,
			...accessories,
		]
		await db.insert(products).values(allProducts)

		// Добавляем промокоды
		console.log('🎫 Adding promo codes...')
		const promos = [
			{
				id: 'promo-1',
				code: 'WELCOMESDFM',
				discount: 15,
				isActive: true,
				expiresAt: null,
				usageLimit: null,
				usageCount: 0,
				createdAt: new Date(),
			},
			{
				id: 'promo-2',
				code: 'SAVE10',
				discount: 10,
				isActive: true,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				usageLimit: 100,
				usageCount: 0,
				createdAt: new Date(),
			},
			{
				id: 'promo-3',
				code: 'HOODIE20',
				discount: 20,
				isActive: true,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				usageLimit: 50,
				usageCount: 0,
				createdAt: new Date(),
			},
			{
				id: 'promo-4',
				code: 'NEWUSER25',
				discount: 25,
				isActive: true,
				expiresAt: null,
				usageLimit: 200,
				usageCount: 0,
				createdAt: new Date(),
			},
		]

		await db.insert(promoCodes).values(promos)

		console.log('✅ Database seeded successfully!')
		console.log(`📦 Added ${allProducts.length} products`)
		console.log(`🎫 Added ${promos.length} promo codes`)
		console.log('👤 Admin: admin@admin.cc / admin1234')
		console.log('👤 User: test@example.com / password123')
		console.log('')
		console.log('🎫 Available promo codes:')
		promos.forEach(promo => {
			console.log(`   ${promo.code} - ${promo.discount}% discount`)
		})
	} catch (error) {
		console.error('❌ Error seeding database:', error)
		throw error
	} finally {
		client.close()
	}
}

seedDatabase().catch(err => {
	console.error('Seeding failed:', err)
	process.exit(1)
})
