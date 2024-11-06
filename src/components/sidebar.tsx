'use client'

import {
	ContextMenu,
	ContextMenuContent,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ContextMenuItem,
	ContextMenuTrigger,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/ui'

import { getChats } from '@/features/chat/actions'
import { Chat } from '@/features/chat/hooks/use-chat'
import { ChatStatistics } from '@/features/chat/interfaces'
import { getChatStatistics } from '@/features/chat/utilities/files'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Info, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

const Sidebar = () => {
	const [chats, setChats] = useState<Chat[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedChat, setSelectedChat] = useState<string | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [chatStats, setChatStats] = useState<ChatStatistics | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const pathname = usePathname()

	useEffect(() => {
		const fetchChats = async () => {
			setIsLoading(true)
			try {
				const fetchedChats = await getChats() as Chat[]
				if (Array.isArray(fetchedChats)) {
					setChats(fetchedChats)
				} else {
					console.error(
						'Fetched chats is not an array:',
						fetchedChats
					)
					setChats([])
				}
			} catch (error) {
				console.error('Error fetching chats:', error)
				setChats([])
			} finally {
				setIsLoading(false)
			}
		}
		fetchChats()
	}, [])

	const handleInfoClick = async (chatId: string) => {
		setSelectedChat(chatId)
		try {
			const stats = await getChatStatistics(chatId)
			setChatStats(stats)
			setIsDialogOpen(true)
		} catch (error) {
			console.error('Error fetching chat statistics:', error)
		}
	}

	const filteredChats = chats.filter((chat: Chat) => {
		const searchLower = searchQuery.toLowerCase()
		const chatIdMatch = chat.id.toLowerCase().includes(searchLower)
		const messageMatch = chat.lastMessage
			?.toLowerCase()
			.includes(searchLower)
		return chatIdMatch || messageMatch
	})

	return (
		<div className="w-64 border-r border-border bg-background">
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

			{isLoading ? (
				<div className="space-y-2 p-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="animate-pulse">
							<div className="flex items-center space-x-4">
								<div className="h-10 w-10 rounded-full bg-muted" />
								<div className="space-y-2 flex-1">
									<div className="h-4 w-1/4 rounded bg-muted" />
									<div className="h-3 w-1/2 rounded bg-muted" />
								</div>
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
						<ContextMenu key={chat.id}>
							<ContextMenuTrigger>
								<Link
									href={`/dashboard/chats/${chat.id}`}
									className={cn(
										'flex items-center space-x-4 px-4 py-2 hover:bg-accent',
										pathname ===
											`/dashboard/chats/${chat.id}` &&
											'bg-accent'
									)}
								>
									<Avatar>
										<AvatarImage
											src={`/avatars/${chat.id}.png`}
										/>
										<AvatarFallback>CH</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											Chat {chat.id}
										</p>
										<p className="text-xs text-muted-foreground">
											{chat.lastMessage || 'No messages'}
										</p>
									</div>
								</Link>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem
									onSelect={() => handleInfoClick(chat.id)}
								>
									<Info className="mr-2 h-4 w-4" />
									View Info
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					))}
				</div>
			)}

			{chatStats && (
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold">
								Chat Analytics
							</DialogTitle>
						</DialogHeader>
						<Tabs defaultValue="overview" className="mt-4">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="overview">
									Overview
								</TabsTrigger>
								<TabsTrigger value="activity">
									Activity
								</TabsTrigger>
								<TabsTrigger value="participants">
									Participants
								</TabsTrigger>
								<TabsTrigger value="content">
									Content
								</TabsTrigger>
							</TabsList>
							<TabsContent value="overview" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Total Messages
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.overview
														.messageCount
												}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Participants
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.overview
														.participantCount
												}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Duration
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.overview
														.durationDays
												}{' '}
												days
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Avg Messages/Day
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.overview
														.avgMessagesPerDay
												}
											</div>
										</CardContent>
									</Card>
								</div>
								<div className="space-y-2">
									<p>
										First Message:{' '}
										{format(
											new Date(
												chatStats.overview.firstMessageDate
											),
											'PPpp'
										)}
									</p>
									<p>
										Last Message:{' '}
										{format(
											new Date(
												chatStats.overview.lastMessageDate
											),
											'PPpp'
										)}
									</p>
								</div>
							</TabsContent>

							<TabsContent value="activity" className="space-y-4">
								<div className="h-[200px] mt-4">
									<ResponsiveContainer
										width="100%"
										height="100%"
									>
										<BarChart
											data={
												chatStats.activity
													.hourlyActivity
											}
										>
											<XAxis dataKey="hour" />
											<YAxis />
											<Tooltip />
											<Bar
												dataKey="count"
												fill="hsl(var(--primary))"
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
								<div className="space-y-2 mt-4">
									<p>
										Most Active Hour:{' '}
										{chatStats.activity.mostActiveHour}:00
									</p>
									<p>
										Most Active Day:{' '}
										{chatStats.activity.mostActiveDay}
									</p>
								</div>
							</TabsContent>

							<TabsContent
								value="participants"
								className="space-y-4"
							>
								{chatStats.participants.map(
									(participant, index) => (
										<Card key={index}>
											<CardHeader>
												<CardTitle className="text-sm">
													{participant.name}
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-2">
												<p>
													Messages:{' '}
													{participant.messageCount}
												</p>
												<p>
													Avg Message Length:{' '}
													{Math.round(
														participant.avgMessageLength
													)}{' '}
													chars
												</p>
												<p>
													Longest Message:{' '}
													{participant.longestMessage}{' '}
													chars
												</p>
												<p>
													Shortest Message:{' '}
													{
														participant.shortestMessage
													}{' '}
													chars
												</p>
											</CardContent>
										</Card>
									)
								)}
							</TabsContent>

							<TabsContent value="content" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Avg Message Length
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.content
														.avgMessageLength
												}{' '}
												chars
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Total Characters
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.content
														.totalCharacters
												}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Attachments
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{
													chatStats.content
														.attachmentCount
												}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Message Types
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-2">
											<p>
												Short ({'<'}10 chars):{' '}
												{
													chatStats.content
														.shortMessages
												}
											</p>
											<p>
												Long ({'>'}100 chars):{' '}
												{chatStats.content.longMessages}
											</p>
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</DialogContent>
				</Dialog>
			)}
		</div>
	)
}

export default Sidebar
