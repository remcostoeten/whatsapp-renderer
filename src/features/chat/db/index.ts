import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

neonConfig.fetchConnectionCache = true

const DATABASE_URL = "postgresql://neondb_owner:JYvcF0Texq4K@ep-white-field-a2cj8raw.eu-central-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(DATABASE_URL, { fullResults: true })
export const db = drizzle(sql, {
	logger: process.env.NODE_ENV === 'development'
})

export type DbClient = typeof db
