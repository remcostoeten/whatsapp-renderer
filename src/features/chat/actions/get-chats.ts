import { desc } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function getChats() {
	const chats = await db
		.select({
			chatId: messages.chatId,
			lastMessage: messages.message,
			timestamp: messages.timestamp
		})
		.from(messages)
		.orderBy(desc(messages.timestamp))
		.groupBy(messages.chatId)

	return chats.map(
		(chat: {
			chatId: any
			lastMessage: any
			timestamp: { toISOString: () => any }
		}) => ({
			id: chat.chatId,
			lastMessage: chat.lastMessage,
			timestamp: chat.timestamp?.toISOString()
		})
	)
}
