import { create } from 'zustand'
import { useSettingsStore } from './settings-store'

type SidebarStore = {
	isOpen: boolean
	toggleSidebar: () => void
	setSidebarOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
	isOpen: !useSettingsStore.getState().defaultCollapsed,
	toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
	setSidebarOpen: (open: boolean) => set({ isOpen: open })
}))
