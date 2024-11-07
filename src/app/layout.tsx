import ClientSideLayout from '@/components/client-layout'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ClientSideLayout>{children}</ClientSideLayout>
					<Toaster position="top-center" />
				</ThemeProvider>
			</body>
		</html>
	)
}
