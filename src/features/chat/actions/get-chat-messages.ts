'use server'

import { desc, eq } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function getChatMessages(chatId: string, page = 1, pageSize = 50) {
	console.log('Fetching messages for chat:', chatId)

	try {
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
			.orderBy(desc(messages.timestamp))
			.limit(pageSize)
			.offset(offset)

		console.log('Found messages:', results.length)

		return {
			messages: results,
			totalCount: results.length
		}
	} catch (error) {
		console.error('Error in getChatMessages:', error)
		throw new Error('Failed to fetch messages')
	}
}
