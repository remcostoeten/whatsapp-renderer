'use server'

import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function getChatMessages(chatId: string, page = 1, pageSize = 50) {
	console.log('Fetching messages for chat:', chatId)

	try {
		// First get total count
		const countResult = await db
			.select({
				count: sql<number>`count(*)`
			})
			.from(messages)
			.where(eq(messages.chatId, chatId))

		const totalCount = Number(countResult[0].count)

		// Then get paginated results - always newest first
		const offset = (page - 1) * pageSize
		const results = await db
			.select({
				id: messages.id,
				name: messages.name,
				message: messages.message,
				timestamp: messages.timestamp,
				attachment: messages.attachment
			})
			.from(messages)
			.where(eq(messages.chatId, chatId))
			.orderBy(desc(messages.timestamp)) // Always newest first
			.limit(pageSize)
			.offset(offset)

		console.log('Found messages:', results.length, 'Total:', totalCount)

		return {
			messages: results,
			totalCount: totalCount
		}
	} catch (error) {
		console.error('Error in getChatMessages:', error)
		throw new Error('Failed to fetch messages')
	}
}
