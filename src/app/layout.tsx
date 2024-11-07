import Breadcrumbs from '@/components/breadcrumbs'
import Sidebar from '@/components/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import TopNavigation from '@/components/top-navigation'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import './globals.css'

const geistSans = localFont({
	src: '../core/config/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})

const geistMono = localFont({
	src: '../core/config/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`dark theme-custom${geistSans.variable} ${geistMono.variable}`}
		>
			<body className="min-h-screen bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex h-screen">
						<Sidebar />
						<div className="flex-1 flex flex-col overflow-hidden">
							<TopNavigation />
							<Breadcrumbs />
							<main className="flex-1 overflow-auto">
								{children}
							</main>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
