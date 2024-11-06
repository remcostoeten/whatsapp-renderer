import { DrizzleD1Database } from 'drizzle-orm/d1'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const chats = pgTable('chats', {
	id: varchar('id', { length: 36 }).primaryKey(),
	name: varchar('name', { length: 100 }),
	lastMessage: text('last_message'),
	timestamp: timestamp('timestamp').defaultNow()
})

// Add other tables as needed...

export async function up(db: DrizzleD1Database) {
	await db.schema.createTable(chats)
}

export async function down(db: DrizzleD1Database) {
	await db.schema.dropTable(chats)
}
