import { db } from '@/features/chat/db'
import { messages } from '@/features/chat/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
	try {
		// Get all chats with their latest messages
		const chats = await db
			.select({
				id: messages.chatId,
				lastMessage: messages.message,
				timestamp: messages.timestamp
			})
			.from(messages)
			.orderBy(desc(messages.timestamp))

		// Group by chatId and get the latest message for each chat
		const latestChats = Object.values(
			chats.reduce((acc, curr) => {
				if (!acc[curr.id] || new Date(curr.timestamp) > new Date(acc[curr.id].timestamp)) {
					acc[curr.id] = curr
				}
				return acc
			}, {} as Record<string, typeof chats[0]>)
		)

		// Sort by timestamp descending
		latestChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

		console.log('Fetched chats:', latestChats)

		return Response.json(latestChats)
	} catch (error) {
		console.error('Failed to fetch chats:', error)
		return Response.error()
	}
} 
