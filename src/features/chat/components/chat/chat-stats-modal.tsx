'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { getDashboardStats } from '../../actions'
import { getChatOverview } from '../../actions/get-chat-overview'

type DashboardStats = {
	totalMessages: number
	totalChats: number
	uniqueContacts: number
	dateRange: string
}

type ChatOverviewData = {
	name: string
	messages: number
}

type Props = {
	open: boolean
	onOpenChange: (open: boolean) => void
	chatId: string
}

export default function ChatStatisticsModal({
	open,
	onOpenChange,
	chatId
}: Props) {
	const [statistics, setStatistics] = useState<DashboardStats | null>(null)
	const [chatOverview, setChatOverview] = useState<ChatOverviewData[]>([])

	useEffect(() => {
		if (open && chatId) {
			const fetchData = async () => {
				const [stats, overview] = await Promise.all([
					getDashboardStats(),
					getChatOverview()
				])
				setStatistics(stats)
				setChatOverview(overview)
			}
			fetchData()
		}
	}, [open, chatId])

	if (!statistics) {
		return null
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Chat Statistics</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="users">Users</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<div className="grid grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Total Messages</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.totalMessages}
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Total Chats</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.totalChats}
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Unique Contacts</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.uniqueContacts}
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Date Range</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.dateRange}
									</p>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
					<TabsContent value="users">
						<Card>
							<CardHeader>
								<CardTitle>Messages by User</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={chatOverview}
											dataKey="messages"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label
										>
											{chatOverview.map(
												(_entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={
															COLORS[
																index %
																	COLORS.length
															]
														}
													/>
												)
											)}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="activity">
						<Card>
							<CardHeader>
								<CardTitle>Message Activity</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={[]}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="hour" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="count" fill="#8884d8" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="content">
						<div className="grid grid-cols-2 gap-4">
							{/* Add content statistics cards here */}
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']
