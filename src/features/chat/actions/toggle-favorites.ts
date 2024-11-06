import { eq } from 'drizzle-orm'
import { db } from '../db'
import { messages } from '../db/schema'

export type ToggleFavoriteResult = {
	success: boolean
	isFavorite?: boolean
}

export async function toggleFavorite(
	messageId: string
): Promise<ToggleFavoriteResult> {
	try {
		const currentMessage = await db
			.select()
			.from(messages)
			.where(eq(messages.id, messageId))
			.limit(1)

		if (!currentMessage?.[0]) {
			return { success: false }
		}

		await db
			.update(messages)
			.set({
				isFavorite: !currentMessage[0].isFavorite
			})
			.where(eq(messages.id, messageId))

		return {
			success: true,
			isFavorite: !currentMessage[0].isFavorite
		}
	} catch (error) {
		console.error('Error toggling favorite:', error)
		return { success: false }
	}
}
