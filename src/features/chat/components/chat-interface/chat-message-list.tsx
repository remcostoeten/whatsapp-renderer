import { cn } from '@/lib/utils'
import * as React from 'react'
import { useEffect, useRef } from 'react'

type ChatMessageListProps = React.HTMLAttributes<HTMLDivElement> & {
	shouldAutoScroll?: boolean
	isLoadingMore?: boolean
	isEmpty?: boolean
	emptyMessage?: string
	onScrollTop?: () => void
	pageSize?: number
	totalMessages?: number
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
	(
		{
			className,
			children,
			shouldAutoScroll = true,
			isLoadingMore = false,
			isEmpty = false,
			emptyMessage = 'No messages found. This chat might be empty.',
			onScrollTop,
			pageSize = 50,
			totalMessages = 0,
			...props
		},
		ref
	) => {
		const scrollRef = useRef<HTMLDivElement>(null)
		const prevScrollHeightRef = useRef<number>(0)
		const throttleRef = useRef<NodeJS.Timeout | null>(null)
		const currentPageRef = useRef<number>(1)

		// Calculate total pages based on pageSize
		const totalPages = Math.ceil(totalMessages / pageSize)

		useEffect(() => {
			const scrollElement = scrollRef.current
			if (!scrollElement) return

			if (isLoadingMore) {
				prevScrollHeightRef.current = scrollElement.scrollHeight
			} else if (prevScrollHeightRef.current > 0) {
				const newScrollHeight = scrollElement.scrollHeight
				const scrollDiff = newScrollHeight - prevScrollHeightRef.current
				scrollElement.scrollTop = scrollDiff
				prevScrollHeightRef.current = 0
			} else if (shouldAutoScroll) {
				scrollElement.scrollTop = scrollElement.scrollHeight
			}
		}, [children, shouldAutoScroll, isLoadingMore])

		const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
			const element = e.currentTarget

			if (element.scrollTop === 0 && onScrollTop && !isLoadingMore) {
				// Check if we haven't reached the last page
				if (currentPageRef.current < totalPages) {
					// Throttle the scroll event to prevent multiple calls
					if (throttleRef.current) {
						clearTimeout(throttleRef.current)
					}

					throttleRef.current = setTimeout(() => {
						onScrollTop()
						currentPageRef.current += 1
						throttleRef.current = null
					}, 300)
				}
			}
		}

		return (
			<div
				className={cn(
					'flex flex-col w-full mb-16 h-full p-4 gap-6 overflow-y-auto',
					className
				)}
				ref={(node) => {
					if (typeof ref === 'function') {
						ref(node)
					} else if (ref) {
						ref.current = node
					}
					if (scrollRef.current !== node) {
						scrollRef.current = node
					}
				}}
				onScroll={handleScroll}
				{...props}
			>
				{isEmpty ? (
					<div className="flex items-center justify-center h-full text-muted-foreground">
						{emptyMessage}
					</div>
				) : (
					children
				)}
			</div>
		)
	}
)

ChatMessageList.displayName = 'ChatMessageList'

export { ChatMessageList }
