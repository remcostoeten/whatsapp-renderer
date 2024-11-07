m'use client'

import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { toggleFavorite } from '../../actions'

type Props = {
	messageId: number
	initialIsFavorite?: boolean
}

export default function FavoriteButton({
	messageId,
	initialIsFavorite = false
}: Props) {
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
	const [isLoading, setIsLoading] = useState(false)

	const handleToggle = async () => {
		try {
			setIsLoading(true)
			const result = await toggleFavorite(messageId)

			if (result.success) {
				setIsFavorite(!isFavorite)
				toast.success(
					!isFavorite
						? 'Added to favorites'
						: 'Removed from favorites'
				)
			} else {
				toast.error('Failed to update favorite status')
			}
		} catch {
			toast.error('An error occurred')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleToggle}
			disabled={isLoading}
			className="h-8 w-8"
		>
			<Star
				className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
			/>
		</Button>
	)
}
