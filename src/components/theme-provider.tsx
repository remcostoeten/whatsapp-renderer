'use client'

import { useSettingsStore } from '@/features/store/settings-store'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { useEffect } from 'react'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const { theme, setTheme } = useSettingsStore()

	// Sync theme changes with next-themes
	useEffect(() => {
		const handleThemeChange = (newTheme: string) => {
			setTheme(newTheme as 'light' | 'dark' | 'system')
		}

		// Set initial theme
		handleThemeChange(theme)

		// Listen for theme changes
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
			'change',
			(e) => {
				if (theme === 'system') {
					handleThemeChange(e.matches ? 'dark' : 'light')
				}
			}
		)
	}, [theme, setTheme])

	return (
		<NextThemesProvider {...props}>
			{children}
		</NextThemesProvider>
	)
}
