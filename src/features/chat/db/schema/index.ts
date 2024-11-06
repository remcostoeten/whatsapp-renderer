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
		attachment: text('attachment')
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
		// Updated primaryKey syntax
		pk: primaryKey({ columns: [table.clerkId, table.messageId] }),
		userFavoritesIdx: index('user_favorites_idx').on(
			table.clerkId,
			table.timestamp
		)
	})
)

export const chatSettings = pgTable(
	'chat_settings',
	{
		chatId: varchar('chat_id', { length: 36 }).primaryKey(),
		isHidden: boolean('is_hidden').default(false).notNull(),
		clerkId: varchar('clerk_id', { length: 255 }).notNull(),
		lastViewed: timestamp('last_viewed').defaultNow()
	},
	(table) => ({
		userChatsIdx: index('user_chats_idx').on(table.clerkId, table.isHidden)
	})
)
