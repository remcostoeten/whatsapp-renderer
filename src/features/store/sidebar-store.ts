import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarStore = {
	isCollapsed: boolean
	toggleSidebar: () => void
	setSidebarCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarStore>()(
	persist(
		(set) => ({
			isCollapsed: false,
			toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
			setSidebarCollapsed: (collapsed) => set({ isCollapsed: collapsed })
		}),
		{
			name: 'sidebar-state'
		}
	)
)
