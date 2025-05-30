import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique().default('user'),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').notNull().default('user'),
	avatar: text('avatar'),
	isVerified: integer('is_verified', { mode: 'boolean' })
		.notNull()
		.default(false),
	createdAt: text('created_at').notNull(),
})

export const verificationCodes = sqliteTable('verification_codes', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	code: text('code').notNull(),
	expiresAt: text('expires_at').notNull(),
	createdAt: text('created_at').notNull(),
})

export const products = sqliteTable('products', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	price_usd: real('price_usd').notNull(),
	price_rub: real('price_rub').notNull(),
	image: text('image').notNull(),
	category: text('category').notNull(),
	in_stock: integer('in_stock', { mode: 'boolean' }).notNull().default(true),
	created_at: text('created_at').notNull(),
})

export const orders = sqliteTable('orders', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	totalAmount: real('total_amount').notNull(),
	currency: text('currency').notNull().default('USD'),
	promoCode: text('promo_code'),
	discount: real('discount').default(0),
	status: text('status').notNull().default('pending'),
	createdAt: text('created_at').notNull(),
})

export const orderItems = sqliteTable('order_items', {
	id: text('id').primaryKey(),
	orderId: text('order_id').notNull(),
	productId: text('product_id').notNull(),
	quantity: integer('quantity').notNull(),
	price: real('price').notNull(),
})

export const promoCodes = sqliteTable('promo_codes', {
	id: text('id').primaryKey(),
	code: text('code').notNull().unique(),
	discount: real('discount').notNull(),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	expiresAt: text('expires_at'),
	usageLimit: integer('usage_limit'),
	usageCount: integer('usage_count').notNull().default(0),
	createdAt: text('created_at').notNull(),
})

export const promoUsage = sqliteTable('promo_usage', {
	id: text('id').primaryKey(),
	promoCodeId: text('promo_code_id').notNull(),
	userId: text('user_id').notNull(),
	orderId: text('order_id').notNull(),
	usedAt: text('used_at').notNull(),
})
