'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useState } from 'react'

type Chat = {
	id: string
	lastMessage: string | null
	timestamp: string | null
}

type ChatListProps = {
	initialChats: Chat[]
}

export default function ChatList({ initialChats }: ChatListProps) {
	const [chats, setChats] = useState<Chat[]>(initialChats)

	return (
		<div className="space-y-2 p-4">
			{chats.map((chat) => (
				<Link
					key={chat.id}
					href={`/chats/${chat.id}`}
					className="block p-4 rounded-lg border hover:bg-accent transition-colors"
				>
					<div className="flex justify-between items-start">
						<div>
							<h3 className="font-medium">Chat {chat.id}</h3>
							<p className="text-sm text-muted-foreground">
								{chat.lastMessage || 'No messages'}
							</p>
						</div>
						{chat.timestamp && (
							<span className="text-xs text-muted-foreground">
								{format(new Date(chat.timestamp), 'PPp')}
							</span>
						)}
					</div>
				</Link>
			))}
		</div>
	)
}
