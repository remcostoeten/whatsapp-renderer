'use client'

import {
	Select,
	Dialog,
	Button,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch,
	Label
} from '@/components/ui/'
import { useSettingsStore } from '@/features/store/settings-store'
import { Settings } from 'lucide-react'

const pageSizeOptions = [10, 25, 50, 75, 100]

export default function SettingsDialog() {
	const {
		defaultCollapsed,
		useInfiniteScroll,
		defaultPageSize,
		setDefaultCollapsed,
		setUseInfiniteScroll,
		setDefaultPageSize
	} = useSettingsStore()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings className="h-5 w-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex items-center justify-between">
						<Label htmlFor="sidebar-collapsed">
							Sidebar Collapsed by Default
						</Label>
						<Switch
							id="sidebar-collapsed"
							checked={defaultCollapsed}
							onCheckedChange={setDefaultCollapsed}
						/>
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
						<Label htmlFor="page-size">Default Page Size</Label>
						<Select
							value={defaultPageSize.toString()}
							onValueChange={(value) =>
								setDefaultPageSize(Number(value))
							}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{pageSizeOptions.map((size) => (
									<SelectItem
										key={size}
										value={size.toString()}
									>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
