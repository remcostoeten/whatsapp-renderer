'use client'

import { useEffect, useState } from 'react'
import { getChatMessages } from '../../actions/get-chat-messages'

type Message = {
	id: string
	name: string
	message: string
	timestamp: Date
	attachment?: string
}

type ChatMessagesProps = {
	chatId: string
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const pageSize = 20

	useEffect(() => {
		loadMessages()
	}, [chatId, page])

	async function loadMessages(reset = false) {
		if (!chatId) return
		
		try {
			setIsLoading(true)
			const response = await getChatMessages(chatId, reset ? 1 : page, pageSize)
			
			if (reset) {
				setMessages(response.messages)
				setPage(1)
			} else {
				setMessages(prev => [...prev, ...response.messages])
			}
			
			setHasMore(response.messages.length === pageSize)
		} catch (err) {
			console.error('Error loading messages:', err)
			setError('Failed to load messages')
		} finally {
			setIsLoading(false)
		}
	}

	function loadMore() {
		if (!isLoading && hasMore) {
			setPage(prev => prev + 1)
		}
	}

	if (error) {
		return <div className="p-4 text-red-500">{error}</div>
	}

	if (!messages.length && !isLoading) {
		return <div className="p-4 text-muted-foreground">No messages found</div>
	}

	const currentUser = "Remco" // You might want to get this from your auth context

	return (
		<div className="flex flex-col-reverse gap-4 p-4">
			{messages.map((message) => {
				const isOwnMessage = message.name === currentUser
				
				return (
					<div 
						key={message.id} 
						className={`flex flex-col gap-1 max-w-[80%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
					>
						<div 
							className={`p-4 rounded-lg ${
								isOwnMessage 
									? 'bg-primary text-primary-foreground rounded-br-none' 
									: 'bg-muted rounded-bl-none'
							}`}
						>
							<div className="flex justify-between items-start gap-4">
								<span className="text-sm font-medium">{message.name}</span>
								<span className="text-xs opacity-70">
									{new Date(message.timestamp).toLocaleString()}
								</span>
							</div>
							<p className="mt-1">{message.message}</p>
							{message.attachment && (
								<a 
									href={message.attachment} 
									target="_blank" 
									rel="noopener noreferrer"
									className="text-sm text-blue-500 hover:underline mt-2 block"
		<div className="flex flex-col gap-4 p-4">
			{messages.map((message) => (
				<div
					key={message.id}
					className="flex flex-col gap-1 p-4 rounded-lg bg-accent"
				>
					<div className="flex justify-between items-start">
						<span className="font-medium">{message.name}</span>
						<span className="text-xs text-muted-foreground">
							{new Date(message.timestamp).toLocaleString()}
						</span>
					</div>
					<p className="text-sm">{message.message}</p>
					{message.attachment && (
						<a
							href={message.attachment}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-blue-500 hover:underline"
						>
							View Attachment
						</a>
					)}
				</div>
			))}
		</div>
	)
}
