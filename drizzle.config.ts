import type { Config } from 'drizzle-kit'

export default {
	schema: './src/features/chat/db/schema.ts',
	out: './src/features/chat/db/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: "postgresql://neondb_owner:JYvcF0Texq4K@ep-white-field-a2cj8raw.eu-central-1.aws.neon.tech/neondb?sslmode=require"
	}
} satisfies Config
