import { useEffect, useState } from 'react'
import { addFavorite, isFavorite, removeFavorite } from '../../utilities/files'

type FavoriteButtonProps = {
	messageId: string
}

export default function FavoriteButton({ messageId }: FavoriteButtonProps) {
	const [isFavorited, setIsFavorited] = useState(false)

	useEffect(() => {
		const checkFavorite = async () => {
			const favorited = await isFavorite(messageId)
			setIsFavorited(favorited)
		}
		checkFavorite()
	}, [messageId])

	const handleToggleFavorite = async () => {
		if (isFavorited) {
			await removeFavorite(messageId)
		} else {
			await addFavorite(messageId)
		}
		setIsFavorited(!isFavorited)
	}

	return (
		<button onClick={handleToggleFavorite}>
			{isFavorited ? 'Unfavorite' : 'Favorite'}
		</button>
	)
}
