import { desc, sql } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function searchMessages(chatId: string, query: string) {
	const searchResults = await db
		.select({
			id: messages.id,
			message: messages.message,
			timestamp: messages.timestamp,
			messageIndex: sql<number>`ROW_NUMBER() OVER (ORDER BY timestamp DESC) - 1`
		})
		.from(messages)
		.where(
			sql`${messages.chatId} = ${chatId} AND ${messages.message} ILIKE ${`%${query}%`}`
		)
		.orderBy(desc(messages.timestamp))
		.limit(20)

	return searchResults.map((result) => ({
		id: result.id,
		index: result.messageIndex,
		message: result.message,
		timestamp: result.timestamp?.toString()
	}))
}
