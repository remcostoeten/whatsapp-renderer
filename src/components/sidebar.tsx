'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { getChats } from '@/features/chat/actions'
import { useSettingsStore } from '@/features/store/settings-store'
import { useSidebarStore } from '@/features/store/use-sidebar-store'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Chat = {
	id: string
	lastMessage: string | null
	timestamp: string | null
}

export default function Sidebar() {
	const isCollapsed = useSidebarStore((state) => state.isCollapsed)
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
	const defaultCollapsed = useSettingsStore((state) => state.defaultCollapsed)
	const [chats, setChats] = useState<Chat[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const pathname = usePathname()

	useEffect(() => {
		if (defaultCollapsed !== isCollapsed) {
			toggleSidebar()
		}
	}, [defaultCollapsed, isCollapsed, toggleSidebar])

	useEffect(() => {
		async function fetchChats() {
			setIsLoading(true)
			try {
				const fetchedChats = await getChats()
				setChats(fetchedChats)
			} catch (error) {
				console.error('Error fetching chats:', error)
				setChats([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchChats()
	}, [])

	const filteredChats = chats.filter((chat) => {
		const searchLower = searchQuery.toLowerCase()
		const chatIdMatch = chat.id.toLowerCase().includes(searchLower)
		const messageMatch = chat.lastMessage
			?.toLowerCase()
			.includes(searchLower)
		return chatIdMatch || messageMatch
	})

	return (
		<div
			className={cn(
				'border-r bg-background',
				'transition-all duration-300 ease-in-out',
				isCollapsed ? 'w-[60px]' : 'w-[300px]'
			)}
		>
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

			<div className="space-y-2">
				{isLoading ? (
					<div className="space-y-2 p-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="animate-pulse">
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 rounded-full bg-muted" />
									{!isCollapsed && (
										<div className="space-y-2 flex-1">
											<div className="h-4 w-1/4 rounded bg-muted" />
											<div className="h-3 w-1/2 rounded bg-muted" />
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : filteredChats.length === 0 ? (
					<div className="p-4 text-center text-muted-foreground">
						No chats found
					</div>
				) : (
					<div className="space-y-2">
						{filteredChats.map((chat) => (
							<Link
								key={chat.id}
								href={`/chats/${chat.id}`}
								className={cn(
									'flex items-center px-4 py-2 hover:bg-accent',
									!isCollapsed && 'space-x-4',
									pathname === `/chats/${chat.id}` &&
										'bg-accent'
								)}
							>
								<Avatar>
									<AvatarImage
										src={`/avatars/${chat.id}.png`}
									/>
									<AvatarFallback>CH</AvatarFallback>
								</Avatar>
								{!isCollapsed && (
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											Chat {chat.id}
										</p>
										<p className="text-xs text-muted-foreground">
											{chat.lastMessage || 'No messages'}
										</p>
									</div>
								)}
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
