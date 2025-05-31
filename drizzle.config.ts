import type { Config } from 'drizzle-kit'

const config: Config = {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./sqlite.db',
  },
};

console.log('Drizzle Config:', config);

export default config satisfies Config