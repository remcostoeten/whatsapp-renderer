'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface FavoriteMessage {
	id: number
	chatId: string
	message: string
	timestamp: Date
	name: string
}

export default function FavoritesPage() {
	const [favoriteMessages, setFavoriteMessages] = useState<FavoriteMessage[]>(
		[]
	)

	useEffect(() => {
		const fetchFavorites = async () => {
			const result = await getFavoriteMessages()
			setFavoriteMessages(result)
		}

		fetchFavorites()
	}, [])

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Favorite Messages</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{favoriteMessages.map((message) => (
					<Card key={message.id}>
						<CardHeader>
							<CardTitle>{message.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-2">{message.message}</p>
							<div className="flex justify-between text-sm text-muted-foreground">
								<span>{format(message.timestamp, 'PPP')}</span>
								<Link
									href={`/chats/${message.chatId}`}
									className="text-primary hover:underline"
								>
									View in Chat
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
