'use client'

import { LoaderWithText } from '@/components/loader'
import PaginationToolbar from '@/components/ui/pagination-toolbar'
import { useSettingsStore } from '@/features/store/settings-store'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getChatMessages } from '../../actions/get-chat-messages'

type Message = {
	id: string
	name: string
	message: string
	timestamp: Date
	attachment: string | null
}

type ChatMessagesProps = {
	chatId: string
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [totalMessages, setTotalMessages] = useState(0)
	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const prevScrollHeightRef = useRef<number>(0)

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Get page and pageSize from URL or defaults
	const pageFromUrl = Number(searchParams.get('page')) || 1
	const pageSizeFromUrl =
		Number(searchParams.get('pageSize')) ||
		useSettingsStore.getState().pageSize

	const [page, setPage] = useState(pageFromUrl)
	const pageSize = useSettingsStore((state) => state.pageSize)
	const setPageSize = useSettingsStore((state) => state.setPageSize)

	const totalPages = Math.max(1, Math.ceil(totalMessages / pageSize))

	// Update URL when page or pageSize changes
	const updateUrl = (newPage: number, newPageSize: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', newPage.toString())
		params.set('pageSize', newPageSize.toString())
		router.push(`${pathname}?${params.toString()}`)
	}

	// Save scroll position before loading new messages
	useEffect(() => {
		if (messagesContainerRef.current) {
			prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight
		}
	}, [page])

	useEffect(() => {
		if (chatId) {
			loadMessages()
		}
	}, [chatId, page, pageSize])

	// Sync URL with state on mount
	useEffect(() => {
		if (pageFromUrl !== page || pageSizeFromUrl !== pageSize) {
			updateUrl(page, pageSize)
		}
	}, [])

	// Restore scroll position after loading new messages
	useEffect(() => {
		if (messagesContainerRef.current && prevScrollHeightRef.current) {
			const newScrollHeight = messagesContainerRef.current.scrollHeight
			const scrollDiff = newScrollHeight - prevScrollHeightRef.current
			messagesContainerRef.current.scrollTop = scrollDiff
		}
	}, [messages])

	async function loadMessages() {
		try {
			setIsLoading(true)
			const response = await getChatMessages(chatId, page, pageSize)

			const formattedMessages = response.messages.map((msg) => ({
				...msg,
				timestamp: new Date(msg.timestamp),
				attachment: msg.attachment || null
			}))

			setMessages(formattedMessages)
			setTotalMessages(response.totalCount)
		} catch (err) {
			console.error('Error loading messages:', err)
			setError('Failed to load messages')
		} finally {
			setIsLoading(false)
		}
	}

	const handlePageChange = (newPage: number) => {
		if (newPage !== page && newPage > 0 && newPage <= totalPages) {
			setPage(newPage)
			updateUrl(newPage, pageSize)
		}
	}

	const handlePageSizeChange = (newSize: number) => {
		if (setPageSize && newSize !== pageSize) {
			setPageSize(newSize)
			setPage(1)
			updateUrl(1, newSize)
		}
	}

	if (error) {
		return <div className="p-4 text-red-500">{error}</div>
	}

	return (
		<div className="flex flex-col h-full">
			<div 
				ref={messagesContainerRef}
				className="flex-1 overflow-y-auto p-4 flex flex-col"
			>
				{!messages.length && !isLoading ? (
					<div className="text-muted-foreground">
						No messages found
					</div>
				) : (
					messages.map((message) => {
						const isOwnMessage = message.name === 'Remco'

						return (
							<div
								key={message.id}
								className={`flex flex-col gap-1 max-w-[80%] mb-4 ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
							>
								<div
									className={`p-4 rounded-lg ${
										isOwnMessage
											? 'bg-primary text-primary-foreground rounded-br-none'
											: 'bg-muted rounded-bl-none'
									}`}
								>
									<div className="flex justify-between items-start gap-4">
										<span className="text-sm font-medium">
											{message.name}
										</span>
										<span className="text-xs opacity-70">
											{message.timestamp.toLocaleString()}
										</span>
									</div>
									<p className="mt-1">{message.message}</p>
									{message.attachment && (
										<a
											href={message.attachment}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-500 hover:underline mt-2 block"
										>
											View Attachment
										</a>
									)}
								</div>
							</div>
						)
					})
				)}
			</div>

			<div className="sticky bottom-0 bg-background border-t">
				<PaginationToolbar
					currentPage={page}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
					isLoading={isLoading}
				/>

				{isLoading && (
					<div className="p-4">
						<LoaderWithText text="Loading messages..." />
					</div>
				)}
			</div>
		</div>
	)
}
