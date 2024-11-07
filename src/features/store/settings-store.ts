import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsStore = {
	defaultCollapsed: boolean
	useInfiniteScroll: boolean
	pageSize: number
	setDefaultCollapsed: (collapsed: boolean) => void
	setUseInfiniteScroll: (useInfinite: boolean) => void
	setPageSize: (size: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			defaultCollapsed: false,
			useInfiniteScroll: false,
			pageSize: 25,
			setDefaultCollapsed: (collapsed) =>
				set({ defaultCollapsed: collapsed }),
			setUseInfiniteScroll: (useInfinite) =>
				set({ useInfiniteScroll: useInfinite }),
			setPageSize: (size) => set({ pageSize: size })
		}),
		{
			name: 'chat-settings'
		}
	)
)
