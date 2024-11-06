import { desc, sql } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function getChatOverview() {
	const result = await db
		.select({
			chatId: messages.chatId,
			count: sql<number>`count(*)`
		})
		.from(messages)
		.groupBy(messages.chatId)
		.orderBy(desc(sql<number>`count(*)`))
		.limit(5)

	return result.map((row: { chatId: string; count: number }) => ({
		name: row.chatId,
		messages: row.count
	}))
}
