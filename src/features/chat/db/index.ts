import { neon, NeonQueryFunction, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

type DatabaseConfig = {
	DATABASE_URL: string
	SCHEMA: string
	MESSAGES: string
	FAVORITES: string
}

const databaseConfig: DatabaseConfig = {
	DATABASE_URL: process.env.DATABASE_URL || '',
	SCHEMA: process.env.SCHEMA || '',
	MESSAGES: process.env.MESSAGES || '',
	FAVORITES: process.env.FAVORITES || ''
}

let sql: NeonQueryFunction<boolean, boolean>
let db: ReturnType<typeof drizzle>
let pool: Pool

if (typeof window === 'undefined') {
	sql = neon(databaseConfig.DATABASE_URL)
	db = drizzle(sql, {
		schema: {
			messages: databaseConfig.MESSAGES,
			favorites: databaseConfig.FAVORITES
		}
	})
	pool = new Pool({ connectionString: databaseConfig.DATABASE_URL })
}

export { db, pool, sql }
