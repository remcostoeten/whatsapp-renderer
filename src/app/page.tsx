'use client'

import { LoaderWithText } from '@/components/loader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	getChatOverview,
	getDashboardStats,
	getMessageTimeline
} from '@/features/chat/actions'
import { motion } from 'framer-motion'
import { Clock, FileText, MessageSquare, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

type StatCardProps = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	title: string
	value: string | number
	description: string
}

const StatCard = ({ icon: Icon, title, value, description }: StatCardProps) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			<Icon className="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{value}</div>
			<p className="text-xs text-muted-foreground">{description}</p>
		</CardContent>
	</Card>
)

export default function ChatDashboard() {
	const [stats, setStats] = useState({
		totalChats: 0,
		totalMessages: 0,
		uniqueContacts: 0,
		dateRange: ''
	})
	const [chatOverviewData, setChatOverviewData] = useState<
		Array<{ name: string; messages: number }>
	>([])
	const [timelineData, setTimelineData] = useState<
		Array<{ date: string; messages: number }>
	>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchDashboardData = async () => {
			setIsLoading(true)
			try {
				const dashboardStats = await getDashboardStats()
				setStats(dashboardStats)

				const chatOverview = await getChatOverview()
				setChatOverviewData(chatOverview)

				const messageTimeline = await getMessageTimeline()
				setTimelineData(messageTimeline)
			} catch (error) {
				console.error('Error fetching dashboard data:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchDashboardData()
	}, [])

	if (isLoading) {
		return <LoaderWithText text="Loading..." />
	}

	return (
		<div className="p-8 space-y-8">
			<motion.h1
				className="text-3xl font-bold"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Chat Analytics Dashboard
			</motion.h1>

			<motion.div
				className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
				variants={{
					hidden: { opacity: 0 },
					show: {
						opacity: 1,
						transition: {
							staggerChildren: 0.1
						}
					}
				}}
				initial="hidden"
				animate="show"
			>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 }
					}}
				>
					<StatCard
						icon={FileText}
						title="Total Chats"
						value={stats.totalChats}
						description="Across all imports"
					/>
				</motion.div>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 }
					}}
				>
					<StatCard
						icon={MessageSquare}
						title="Total Messages"
						value={stats.totalMessages}
						description="From all chats"
					/>
				</motion.div>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 }
					}}
				>
					<StatCard
						icon={Users}
						title="Unique Contacts"
						value={stats.uniqueContacts}
						description="Across all chats"
					/>
				</motion.div>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 }
					}}
				>
					<StatCard
						icon={Clock}
						title="Date Range"
						value={stats.dateRange}
						description="First to last message"
					/>
				</motion.div>
			</motion.div>

			<motion.div
				className="grid gap-4 md:grid-cols-2"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
			>
				<Card>
					<CardHeader>
						<CardTitle>Chat Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ width: '100%', height: 300 }}>
							<ResponsiveContainer>
								<BarChart data={chatOverviewData}>
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Bar
										dataKey="messages"
										fill="hsl(var(--primary))"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Message Timeline</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ width: '100%', height: 300 }}>
							<ResponsiveContainer>
								<BarChart data={timelineData}>
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Bar
										dataKey="messages"
										fill="hsl(var(--primary))"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div
				className="text-center text-muted-foreground"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.5 }}
			>
				<p>Select a chat from the sidebar to view detailed analytics</p>
			</motion.div>
		</div>
	)
}
