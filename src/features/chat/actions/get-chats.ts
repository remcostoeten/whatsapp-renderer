'use server'

import { desc, eq, sql } from 'drizzle-orm'
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

export async function getChats() {
	try {
		const chats = await db
			.select({
				chatId: messages.chatId,
				lastMessage: sql<string>`MAX(${messages.message})`,
				timestamp: sql<Date>`MAX(${messages.timestamp})`
			})
			.from(messages)
			.groupBy(messages.chatId)
			.orderBy(sql`MAX(${messages.timestamp}) DESC`)

		return chats.map((chat) => ({
			id: chat.chatId,
			lastMessage: chat.lastMessage ?? null,
			timestamp: chat.timestamp?.toString() ?? null
		}))
	} catch (error) {
		console.error('Error fetching chats:', error)
		return []
	}
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
		timestamp: result.timestamp?.toString()
	}))
}
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

	return result.map((row: { chatId: any; count: any }) => ({
		name: row.chatId,
		messages: row.count
	}))
}

export async function getMessageTimeline() {
	const result = await db
		.select({
			date: sql<string>`date_trunc('month', ${messages.timestamp})`,
			count: sql<number>`count(*)`
		})
		.from(messages)
		.groupBy(sql`date_trunc('month', ${messages.timestamp})`)
		.orderBy(sql`date_trunc('month', ${messages.timestamp})`)
		.limit(12)

	return result.map((row: { date: string | number | Date; count: any }) => ({
		date: new Date(row.date).toString().slice(0, 7), // Format as YYYY-MM
		messages: row.count
	}))
}
