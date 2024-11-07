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
	const isInitialLoadRef = useRef(true)

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { messagesPerPage, sortOrder } = useSettingsStore()

	const pageFromUrl = Number(searchParams.get('page')) || 1
	const pageSizeFromUrl = Number(searchParams.get('pageSize')) || messagesPerPage

	const [page, setPage] = useState(pageFromUrl)

	const totalPages = Math.max(1, Math.ceil(totalMessages / messagesPerPage))

	const updateUrl = (newPage: number, newPageSize: number = messagesPerPage) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('page', newPage.toString())
		params.set('pageSize', newPageSize.toString())
		router.push(`${pathname}?${params.toString()}`)
	}

	// Save scroll position before loading new messages
	useEffect(() => {
		if (!isInitialLoadRef.current && messagesContainerRef.current) {
			prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight
		}
	}, [page])

	useEffect(() => {
		if (chatId) {
			loadMessages()
		}
	}, [chatId, page, messagesPerPage, sortOrder])

	// Sync URL with state on mount
	useEffect(() => {
		if (pageFromUrl !== page || pageSizeFromUrl !== messagesPerPage) {
			updateUrl(page, messagesPerPage)
		}
	}, [])

	// Handle scroll position after loading messages
	useEffect(() => {
		if (!messagesContainerRef.current) return

		// Always maintain scroll position for consistency
		if (prevScrollHeightRef.current) {
			const newScrollHeight = messagesContainerRef.current.scrollHeight
			const scrollDiff = newScrollHeight - prevScrollHeightRef.current
			messagesContainerRef.current.scrollTop = scrollDiff
		}
	}, [messages])

	async function loadMessages() {
		try {
			setIsLoading(true)
			const response = await getChatMessages(chatId, page, messagesPerPage)

			const formattedMessages = response.messages.map((msg) => ({
				...msg,
				timestamp: new Date(msg.timestamp),
				attachment: msg.attachment || null
			}))

			const sortedMessages = [...formattedMessages].sort((a, b) => {
				const comparison = a.timestamp.getTime() - b.timestamp.getTime()
				return sortOrder === 'asc' ? comparison : -comparison
			})

			setMessages(sortedMessages)
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
			updateUrl(newPage, messagesPerPage)
		}
	}

	const handlePageSizeChange = (newSize: number) => {
		setMessagesPerPage(newSize)
		setPage(1)
		isInitialLoadRef.current = true
		updateUrl(1, newSize)
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
					pageSize={messagesPerPage}
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
