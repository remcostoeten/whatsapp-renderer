'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
	const pathname = usePathname()
	const segments = pathname.split('/').filter(Boolean)

	return (
		<nav
			aria-label="Breadcrumb"
			className="flex items-center space-x-2 px-4 py-2 text-sm"
		>
			<Link
				href="/"
				className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
			>
				<Home className="h-4 w-4" />
			</Link>

			{segments.map((segment, index) => {
				const href = `/${segments.slice(0, index + 1).join('/')}`
				const isLast = index === segments.length - 1
				const title = segment.charAt(0).toUpperCase() + segment.slice(1)

				return (
					<div key={segment} className="flex items-center">
						<ChevronRight className="h-4 w-4 text-muted-foreground" />
						{isLast ? (
							<span className="ml-2 font-medium text-foreground">
								{title}
							</span>
						) : (
							<Link
								href={href}
								className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								{title}
							</Link>
						)}
					</div>
				)
			})}
		</nav>
	)
}
