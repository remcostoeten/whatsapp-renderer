import EmptyState from '@/components/empty-state'
import { ChatSkeleton } from '@/components/ui/skeleton-loader'
import { getChats } from '@/features/chat/actions/get-chats'
import ChatList from '@/features/chat/components/chat/chat-list'
import { Suspense } from 'react'

export default async function ChatsPage() {
	const chats = await getChats()

	return (
		<div className="h-full flex flex-col">
			<Suspense
				fallback={
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<ChatSkeleton key={i} />
						))}
					</div>
				}
			>
				{chats.length > 0 ? (
					<ChatList initialChats={chats} />
				) : (
					<EmptyState />
				)}
			</Suspense>
		</div>
	)
}
