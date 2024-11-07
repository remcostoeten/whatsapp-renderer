import { db } from '@/features/chat/db'
import { messages } from '@/features/chat/db/schema'
import { desc, sql } from 'drizzle-orm'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { searchParams } = new URL(request.url)
		const query = searchParams.get('q')
		const chatId = params.id

		if (!query) {
			return Response.json([])
		}

		const results = await db
			.select({
				message: messages.message,
				timestamp: messages.timestamp,
			})
			.from(messages)
			.where(
				sql`${messages.chatId} = ${chatId} AND ${messages.message} ILIKE ${`%${query}%`}`
			)
			.orderBy(desc(messages.timestamp))
			.limit(20)

		return Response.json(results)
	} catch (error) {
		console.error('Search failed:', error)
		return Response.error()
	}
} 
