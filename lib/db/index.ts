import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// Создаем клиент с путем к файлу базы данных
const client = createClient({
	url: 'file:sqlite.db',
})

// Создаем экземпляр Drizzle с клиентом и схемой
export const db = drizzle(client, { schema })
