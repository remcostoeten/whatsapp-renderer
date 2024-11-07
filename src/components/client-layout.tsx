'use client'

import TopNavigation from '@/components/top-navigation'
import { useSidebarStore } from '@/features/store/sidebar-store'
import type { ReactNode } from 'react'
import Sidebar from './sidebar'

type ClientSideLayoutProps = {
	children: ReactNode
}

export default function ClientSideLayout({ children }: ClientSideLayoutProps) {
	const isCollapsed = useSidebarStore((state) => state.isCollapsed)

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-1 flex flex-col transition-all duration-300">
				<TopNavigation />
				<main className="flex-1 overflow-hidden">{children}</main>
			</div>
		</div>
	)
}
