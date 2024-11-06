import { env } from '@/core/config/env.mjs'
import type { Config } from 'drizzle-kit'

export default {
	schema: './src/features/chat/db/schema.ts',
	out: './src/features/chat/db/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: env.DATABASE_URL
	}
} satisfies Config
