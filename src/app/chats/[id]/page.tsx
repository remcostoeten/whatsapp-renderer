import { LoaderWithText } from '@/components/loader'
import { ChatMessages } from '@/features/chat/components/chat-interface/chat-messages'
import { Suspense } from 'react'
import { SearchBar } from '../_components/search-bar'

type PageProps = {
	params: {
		id: string
	}
}

export default function ChatPage({ params }: PageProps) {
	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b">
				<SearchBar chatId={params.id} />
			</div>
			<div className="flex-1 overflow-y-auto">
				<Suspense
					fallback={<LoaderWithText text="Loading messages..." />}
				>
					<ChatMessages chatId={params.id} />
				</Suspense>
			</div>
		</div>
	)
}
