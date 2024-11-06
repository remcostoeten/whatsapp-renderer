import { create } from 'zustand'
import { useSettingsStore } from './settings-store'

type SidebarStore = {
	isCollapsed: boolean
	toggleSidebar: () => void
	setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
	isCollapsed: useSettingsStore.getState().defaultCollapsed,
	toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
	setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed })
}))
