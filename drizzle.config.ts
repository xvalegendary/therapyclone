import type { Config } from 'drizzle-kit'

export default {
	schema: './lib/db/schema.ts',
	out: './drizzle',
	driver: 'better-sqlite',
  dialect: 'sqlite',
	dbCredentials: {
		url: 'file:sqlite.db',
	},
} satisfies Config
