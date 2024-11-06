'use server'

import { db } from '../db'
import { favorites, messages } from '@/features/chat/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

export async function getChatMessages(
	chatId: string,
	page: number,
	pageSize: number
) {
	const offset = (page - 1) * pageSize
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
		.limit(pageSize)
		.offset(offset)

	const totalCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(messages)
		.where(eq(messages.chatId, chatId))

	const totalPages = Math.ceil(totalCount[0].count / pageSize)

	return {
		messages: messagesResult,
		total: totalCount[0].count,
		totalPages: totalPages
	}
}

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

	return chats.map((chat) => ({
		id: chat.chatId,
		lastMessage: chat.lastMessage,
		timestamp: chat.timestamp?.toISOString()
	}))
}

// actions/chat-action.ts
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
		timestamp: result.timestamp?.toISOString()
	}))
}
export async function addFavorite(messageId: number, userId: string) {
	await db.insert(favorites).values({
		messageId,
		userId
	})
}

export async function removeFavorite(messageId: number, userId: string) {
	await db
		.delete(favorites)
		.where(
			sql`${favorites.messageId} = ${messageId} AND ${favorites.userId} = ${userId}`
		)
}

export async function isFavorite(messageId: number, userId: string) {
	const result = await db
		.select({ id: favorites.id })
		.from(favorites)
		.where(
			sql`${favorites.messageId} = ${messageId} AND ${favorites.userId} = ${userId}`
		)
		.limit(1)

	return result.length > 0
}

export async function getChatStatistics(chatId: string) {
	const messageCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(messages)
		.where(eq(messages.chatId, chatId))

	const participantCount = await db
		.select({ count: sql<number>`count(DISTINCT ${messages.name})` })
		.from(messages)
		.where(eq(messages.chatId, chatId))

	const firstMessage = await db
		.select({ timestamp: messages.timestamp })
		.from(messages)
		.where(eq(messages.chatId, chatId))
		.orderBy(messages.timestamp)
		.limit(1)

	const lastMessage = await db
		.select({ timestamp: messages.timestamp })
		.from(messages)
		.where(eq(messages.chatId, chatId))
		.orderBy(desc(messages.timestamp))
		.limit(1)

	return {
		messageCount: messageCount[0].count,
		participantCount: participantCount[0].count,
		firstMessageDate: firstMessage[0]?.timestamp,
		lastMessageDate: lastMessage[0]?.timestamp
	}
}
