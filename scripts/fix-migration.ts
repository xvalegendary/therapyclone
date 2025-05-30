import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { sql } from 'drizzle-orm'

async function fixMigration() {
	const client = createClient({
		url: 'file:sqlite.db',
	})

	const db = drizzle(client)

	try {
		console.log('🔧 Fixing database migration...')

		// Проверяем, существует ли колонка username
		const tableInfo = await db.all(sql`PRAGMA table_info(users)`)
		const hasUsername = tableInfo.some((col: any) => col.name === 'username')

		if (!hasUsername) {
			console.log('➕ Adding username column...')
			await db.run(sql`ALTER TABLE users ADD COLUMN username TEXT DEFAULT ''`)
			await db.run(
				sql`UPDATE users SET username = LOWER(REPLACE(name, ' ', '_')) || '_' || SUBSTR(id, 1, 4) WHERE username = '' OR username IS NULL`
			)

			// Создаем уникальный индекс после заполнения данных
			await db.run(
				sql`CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username)`
			)
		}

		// Проверяем колонку isVerified
		const hasIsVerified = tableInfo.some(
			(col: any) => col.name === 'is_verified'
		)
		if (!hasIsVerified) {
			console.log('➕ Adding is_verified column...')
			await db.run(
				sql`ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0`
			)
		}

		// Создаем таблицу verification_codes если её нет
		console.log('📧 Creating verification_codes table...')
		await db.run(sql`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

		// Создаем таблицу promo_codes если её нет
		console.log('🎫 Creating promo_codes table...')
		await db.run(sql`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id TEXT PRIMARY KEY NOT NULL,
        code TEXT NOT NULL UNIQUE,
        discount_percent INTEGER NOT NULL,
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0 NOT NULL,
        expires_at TEXT,
        is_active INTEGER DEFAULT 1 NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `)

		console.log('✅ Migration fixed successfully!')
	} catch (error) {
		console.error('❌ Error fixing migration:', error)
		throw error
	} finally {
		client.close()
	}
}

fixMigration().catch(err => {
	console.error('Migration fix failed:', err)
	process.exit(1)
})
