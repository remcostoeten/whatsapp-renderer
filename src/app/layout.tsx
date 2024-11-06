import { ThemeProvider } from '@/components/theme-provider'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import './globals.css'
import ClientSideLayout from '@/components/client-layout'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
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
			className={`dark ${geistSans.variable} ${geistMono.variable}`}
		>
			<body className="min-h-screen bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<ClientSideLayout>{children}</ClientSideLayout>
				</ThemeProvider>
			</body>
		</html>
	)
}
