'use client'

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch
} from '@/components/ui/'
import { useSettingsStore } from '@/features/store/settings-store'
import { Settings } from 'lucide-react'

const pageSizeOptions = [10, 25, 50, 75, 100] as const

export default function SettingsDialog() {
	const pageSize = useSettingsStore((state) => state.pageSize)
	const setPageSize = useSettingsStore((state) => state.setPageSize)
	const useInfiniteScroll = useSettingsStore(
		(state) => state.useInfiniteScroll
	)
	const setUseInfiniteScroll = useSettingsStore(
		(state) => state.setUseInfiniteScroll
	)
	const defaultCollapsed = useSettingsStore((state) => state.defaultCollapsed)
	const setDefaultCollapsed = useSettingsStore(
		(state) => state.setDefaultCollapsed
	)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings className="h-5 w-5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="page-size">Page Size</Label>
						<Select
							value={String(pageSize)}
							onValueChange={(value) =>
								setPageSize(Number(value))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select page size" />
							</SelectTrigger>
							<SelectContent>
								{pageSizeOptions.map((size) => (
									<SelectItem key={size} value={String(size)}>
										{size} messages per page
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="infinite-scroll">
							Use Infinite Scroll
						</Label>
						<Switch
							id="infinite-scroll"
							checked={useInfiniteScroll}
							onCheckedChange={setUseInfiniteScroll}
						/>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="default-collapsed">
							Sidebar Collapsed by Default
						</Label>
						<Switch
							id="default-collapsed"
							checked={defaultCollapsed}
							onCheckedChange={setDefaultCollapsed}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
