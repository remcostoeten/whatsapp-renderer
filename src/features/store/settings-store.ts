"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SortOrder = 'asc' | 'desc'

type SettingsStore = {
	messagesPerPage: number
	sortOrder: SortOrder
	setMessagesPerPage: (count: number) => void
	setSortOrder: (order: SortOrder) => void
	toggleRightSidebar: () => void
	isRightSidebarOpen: boolean
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			messagesPerPage: 25,
			sortOrder: 'desc',
			isRightSidebarOpen: false,
			setMessagesPerPage: (count: number) => {
				set({ messagesPerPage: count })
			},
			setSortOrder: (order: SortOrder) => {
				set({ sortOrder: order })
			},
			toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
		}),
		{
			name: "settings-storage",
		}
	)
)
