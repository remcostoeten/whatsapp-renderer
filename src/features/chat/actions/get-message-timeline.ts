import { sql } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

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

	return result.map(
		(row: { date: string | number | Date; count: number }) => ({
			date: new Date(row.date).toString().slice(0, 7), // Format as YYYY-MM
			messages: row.count
		})
	)
}
