import type { Config } from 'drizzle-kit'

const config: Config = {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pglite',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'file:sqlite.db',
  },
};

console.log('Drizzle Config:', config);

export default config satisfies Config