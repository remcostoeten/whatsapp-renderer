'use server'

import { sql } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export async function getDashboardStats() {
	const totalChats = await db
		.select({ count: sql<number>`count(DISTINCT ${messages.chatId})` })
		.from(messages)

	const totalMessages = await db
		.select({ count: sql<number>`count(*)` })
		.from(messages)

	const uniqueContacts = await db
		.select({ count: sql<number>`count(DISTINCT ${messages.name})` })
		.from(messages)

	const dateRange = await db
		.select({
			min: sql<string>`min(${messages.timestamp})`,
			max: sql<string>`max(${messages.timestamp})`
		})
		.from(messages)

	return {
		totalChats: totalChats[0].count,
		totalMessages: totalMessages[0].count,
		uniqueContacts: uniqueContacts[0].count,
		dateRange: `${new Date(dateRange[0].min).getFullYear()} - ${new Date(dateRange[0].max).getFullYear()}`
	}
}
