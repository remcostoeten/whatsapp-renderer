'use client'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from '@/components/ui/context-menu'
import { useState } from 'react'
import ChatStatisticsModal from './chat-stats-modal'

type Props = {
	chat: {
		id: string
		lastMessage?: string | null
		timestamp?: string | null
	}
	children: React.ReactNode
}

export default function ChatContextMenu({ chat, children }: Props) {
	const [showStats, setShowStats] = useState(false)

	const handleDelete = async () => {
		try {
			console.log('try')
		} catch {
			console.log('catch')
		}
	}

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger>{children}</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setShowStats(true)}>
						View Statistics
					</ContextMenuItem>
					<ContextMenuItem
						className="text-red-600"
						onClick={handleDelete}
					>
						Delete Chat
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<ChatStatisticsModal
				open={showStats}
				onOpenChange={setShowStats}
				chatId={chat.id}
			/>
		</>
	)
}
