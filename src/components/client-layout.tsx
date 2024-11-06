'use client'

import TopNavigation from '@/components/top-navigation'
import { useSidebarStore } from '@/features/store/use-sidebar-store'
import type { ReactNode } from 'react'
import Sidebar from './sidebar'
type ClientSideLayoutProps = {
	children: ReactNode
}

export default function ClientSideLayout({ children }: ClientSideLayoutProps) {
	const isCollapsed = useSidebarStore((state) => state.isCollapsed)

	return (
		<div className="flex h-screen">
			<aside
				className={`${
					!isCollapsed ? 'w-64 opacity-100' : 'w-0 opacity-0'
				} transition-all duration-300 overflow-hidden`}
			>
				<Sidebar />
			</aside>
			<div className="flex-1 flex flex-col">
				<TopNavigation />
				<main className="flex-1 overflow-hidden">{children}</main>
			</div>
		</div>
	)
}
