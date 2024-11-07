'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebarStore } from '@/features/store/sidebar-store'
import { cn } from '@/lib/utils'
import {
	MessageCircle,
	PanelLeftClose,
	PanelLeftOpen,
	Search
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Chat = {
	id: string
	lastMessage: string | null
	timestamp: string | null
}

export default function Sidebar() {
	const [searchQuery, setSearchQuery] = useState('')
	const [chats, setChats] = useState<Chat[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const pathname = usePathname()
	const { isCollapsed, toggleSidebar } = useSidebarStore()

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await fetch('/api/chats')
				const data = await response.json()
				setChats(data)
			} catch (error) {
				console.error('Failed to fetch chats:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchChats()
	}, [])

	const filteredChats = chats.filter((chat) =>
		chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div className="relative">
			<div
				className={cn(
					'flex h-screen flex-col border-r bg-background transition-all duration-300',
					isCollapsed ? 'w-16' : 'w-64'
				)}
			>
				<div className="flex h-14 items-center border-b px-3">
					<Button
						variant="ghost"
						size="icon"
						className="ml-auto"
						onClick={toggleSidebar}
					>
						{isCollapsed ? (
							<PanelLeftOpen className="h-4 w-4" />
						) : (
							<PanelLeftClose className="h-4 w-4" />
						)}
					</Button>
				</div>

				{!isCollapsed && (
					<div className="p-4">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search chats..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				)}

				<ScrollArea className="flex-1">
					<div className="space-y-2 p-2">
						{isLoading ? (
							// Loading skeleton
							<div className="space-y-2">
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className="flex items-center space-x-4 p-2 animate-pulse"
									>
										<div className="h-10 w-10 rounded-full bg-muted" />
										{!isCollapsed && (
											<div className="space-y-2 flex-1">
												<div className="h-4 w-1/4 rounded bg-muted" />
												<div className="h-3 w-1/2 rounded bg-muted" />
											</div>
										)}
									</div>
								))}
							</div>
						) : filteredChats.length === 0 ? (
							<div className="p-4 text-center text-muted-foreground">
								No chats found
							</div>
						) : (
							filteredChats.map((chat) => (
								<Link
									key={chat.id}
									href={`/chats/${chat.id}`}
									className={cn(
										'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
										pathname === `/chats/${chat.id}` &&
											'bg-accent text-accent-foreground'
									)}
								>
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
										<MessageCircle className="h-4 w-4" />
									</div>
									{!isCollapsed && (
										<div className="flex-1 truncate">
											<div className="text-sm font-medium">
												Chat {chat.id}
											</div>
											<div className="text-xs text-muted-foreground truncate">
												{chat.lastMessage ||
													'No messages'}
											</div>
										</div>
									)}
								</Link>
							))
						)}
					</div>
				</ScrollArea>

				<div className="border-t p-4">
					<div
						className={cn(
							'flex items-center gap-3',
							isCollapsed && 'justify-center'
						)}
					>
						<div className="h-8 w-8 rounded-full bg-primary/10" />
						{!isCollapsed && (
							<div className="flex-1">
								<div className="text-sm font-medium">
									User Name
								</div>
								<div className="text-xs text-muted-foreground">
									user@email.com
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
