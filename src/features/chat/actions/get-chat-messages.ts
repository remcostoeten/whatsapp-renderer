import { eq, desc, sql } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function getChatMessages(
	chatId: string,
	page: number,
	pageSize: number
) {
	try {
		// Validate input parameters
		const validatedPage = Math.max(1, Number(page) || 1)
		const validatedPageSize = Math.max(
			1,
			Math.min(100, Number(pageSize) || 30)
		)
		const offset = (validatedPage - 1) * validatedPageSize

		// Get messages for current page
		const messagesResult = await db
			.select({
				id: messages.id,
				name: messages.name,
				message: messages.message,
				timestamp: messages.timestamp,
				attachment: messages.attachment
			})
			.from(messages)
			.where(eq(messages.chatId, chatId))
			.orderBy(desc(messages.timestamp))
			.limit(validatedPageSize)
			.offset(offset)

		// Get total count
		const totalCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(messages)
			.where(eq(messages.chatId, chatId))

		return {
			messages: messagesResult,
			totalCount: Number(totalCount[0]?.count || 0)
		}
	} catch (error) {
		console.error('Error in getChatMessages:', error)
		throw new Error('Failed to fetch messages')
	}
}
