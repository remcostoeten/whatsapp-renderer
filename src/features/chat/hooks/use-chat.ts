'use client'

import { useEffect, useState } from 'react'
import { getChats } from '../utilities/files'

export type Chat = {
	id: string
	name: string
	lastMessage?: string
	timestamp?: string
	isFavorite?: boolean
}

export function useChats() {
	const [chats, setChats] = useState<Chat[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function fetchChats() {
			try {
				const data = await getChats()
				setChats(data)
			} catch (error) {
				console.error('Error fetching chats:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchChats()
	}, [])

	return { data: chats, isLoading }
}
