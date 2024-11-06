import {
	boolean,
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core'

export const messages = pgTable(
	'messages',
	{
		id: varchar('id', { length: 36 }).primaryKey(),
		chatId: varchar('chat_id', { length: 36 }).notNull(),
		name: varchar('name', { length: 100 }).notNull(),
		message: text('message').notNull(),
		timestamp: timestamp('timestamp').defaultNow().notNull(),
		attachment: text('attachment'),
		isFavorite: boolean('is_favorite').default(false)
	},
	(table) => ({
		chatMessagesIdx: index('chat_messages_idx').on(
			table.chatId,
			table.timestamp
		)
	})
)

export const favorites = pgTable(
	'favorites',
	{
		messageId: varchar('message_id', { length: 36 })
			.notNull()
			.references(() => messages.id),
		clerkId: varchar('clerk_id', { length: 255 }).notNull(),
		timestamp: timestamp('timestamp').defaultNow().notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.clerkId, table.messageId] }),
		userFavoritesIdx: index('user_favorites_idx').on(
			table.clerkId,
			table.timestamp
		)
	})
)

export const chats = pgTable('chats', {
	id: varchar('id', { length: 36 }).primaryKey(),
	name: varchar('name', { length: 100 }),
	lastMessage: text('last_message'),
	timestamp: timestamp('timestamp').defaultNow()
})
