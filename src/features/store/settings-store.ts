import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsStore = {
	defaultCollapsed: boolean
	useInfiniteScroll: boolean
	defaultPageSize: number
	setDefaultCollapsed: (collapsed: boolean) => void
	setUseInfiniteScroll: (useInfinite: boolean) => void
	setDefaultPageSize: (size: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			defaultCollapsed: false,
			useInfiniteScroll: false,
			defaultPageSize: 30,
			setDefaultCollapsed: (collapsed) =>
				set({ defaultCollapsed: collapsed }),
			setUseInfiniteScroll: (useInfinite) =>
				set({ useInfiniteScroll: useInfinite }),
			setDefaultPageSize: (size) => set({ defaultPageSize: size })
		}),
		{
			name: 'chat-settings'
		}
	)
)
