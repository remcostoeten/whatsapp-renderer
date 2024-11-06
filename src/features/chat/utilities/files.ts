import { sql } from 'drizzle-orm'
import { db } from '../db'
import { favorites } from '../db/schema'

/**
 * Add a message to favorites.
 * @param messageId - The ID of the message to favorite.
 */
export async function addFavorite(messageId: string) {
	await db.insert(favorites).values({ messageId })
}

/**
 * Remove a message from favorites.
 * @param messageId - The ID of the message to remove from favorites.
 */
export async function removeFavorite(messageId: string) {
	await db.delete(favorites).where(sql`${favorites.messageId} = ${messageId}`)
}

/**
 * Check if a message is a favorite.
 * @param messageId - The ID of the message to check.
 * @returns True if the message is a favorite, false otherwise.
 */
export async function isFavorite(messageId: string) {
	const result = await db
		.select({ messageId: favorites.messageId })
		.from(favorites)
		.where(sql`${favorites.messageId} = ${messageId}`)
		.limit(1)

	return result.length > 0
}
