import { db } from '@/features/chat/db'
import { messages } from '@/features/chat/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id

    const stats = await db
      .select({
        totalMessages: sql<number>`count(*)`,
        createdAt: sql<string>`min(${messages.timestamp})`,
        lastMessageAt: sql<string>`max(${messages.timestamp})`
      })
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .groupBy(messages.chatId)

    if (!stats.length) {
      return Response.json({
        totalMessages: 0,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString()
      })
    }

    return Response.json(stats[0])
  } catch (error) {
    console.error('Failed to fetch chat stats:', error)
    return Response.error()
  }
} 
