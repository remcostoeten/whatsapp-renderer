'use client'

import SettingsDialog from '@/features/chat/components/settings-dialog'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/features/store/use-sidebar-store'
import { Menu } from 'lucide-react'

export default function TopNavigation() {
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
	const isCollapsed = useSidebarStore((state) => state.isCollapsed)

	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
					aria-label={
						isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
					}
				>
					<Menu className="h-5 w-5" />
				</Button>
				<div className="ml-4 font-semibold flex-1">Chat Analytics</div>
				<SettingsDialog />
			</div>
		</div>
	)
}
