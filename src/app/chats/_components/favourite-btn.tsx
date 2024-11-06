'use client'

import { Button } from '@/components/ui/button'
import {
	addFavorite,
	isFavorite,
	removeFavorite
} from '@/features/chat/utilities/files'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

type FavoriteButtonProps = {
	messageId: number
	chatId: string
	isFavorite: boolean
}

export default function FavoriteButton({
	messageId,
	isFavorite: initialIsFavorite
}: FavoriteButtonProps) {
	const [favorite, setFavorite] = useState(initialIsFavorite)
	const userId = 'user123'

	useEffect(() => {
		const checkFavorite = async () => {
			const result = await isFavorite(userId, messageId)
			setFavorite(result)
		}
		checkFavorite()
	}, [userId, messageId])

	const toggleFavorite = async () => {
		try {
			if (favorite) {
				await removeFavorite(userId, messageId)
			} else {
				await addFavorite(userId, messageId)
			}
			setFavorite(!favorite)
		} catch (error) {
			console.error('Error toggling favorite:', error)
		}
	}

	return (
		<Button variant="ghost" size="icon" onClick={toggleFavorite}>
			<Star
				className={`h-4 w-4 ${favorite ? 'text-yellow-500 fill-current' : ''}`}
			/>
		</Button>
	)
}
