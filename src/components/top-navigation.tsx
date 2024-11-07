'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { useSettingsStore } from '@/features/store/settings-store'
import { useSidebarStore } from '@/features/store/sidebar-store'
import { Menu, Search, Settings, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import SettingsDrawer from "./settings-drawer"

type SearchResult = {
	message: string
	timestamp: string
}

export default function TopNavigation() {
	const [showSearch, setShowSearch] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<SearchResult[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
	const isCollapsed = useSidebarStore((state) => state.isCollapsed)
	const toggleRightSidebar = useSettingsStore((state) => state.toggleRightSidebar)

	// Focus search input on mount
	useEffect(() => {
		if (searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}, [])

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check if input or textarea is focused
			const isInputFocused = document.activeElement?.tagName === 'INPUT' || 
								 document.activeElement?.tagName === 'TEXTAREA'

			// Handle '/' key for search
			if (e.key === '/' && !isInputFocused) {
				e.preventDefault()
				setShowSearch(true)
				setTimeout(() => searchInputRef.current?.focus(), 0)
			}

			// Handle Cmd/Ctrl + K for search
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				setShowSearch(true)
				setTimeout(() => searchInputRef.current?.focus(), 0)
			}

			// Handle Escape to close search
			if (e.key === 'Escape' && showSearch) {
				clearSearch()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [showSearch])

	// Get search query from URL on mount
	useEffect(() => {
		const query = searchParams.get('q')
		if (query) {
			setSearchQuery(query)
			setShowSearch(true)
		}
	}, [searchParams])

	const handleSearch = async (query: string) => {
		setSearchQuery(query)
		
		if (query.length > 0) {
			setIsSearching(true)
			try {
				const chatId = pathname.split('/')[2] // Get chatId from URL
				const response = await fetch(`/api/chats/${chatId}/search?q=${query}`)
				const data = await response.json()
				setSearchResults(data)
				setShowSearch(true)
			} catch (error) {
				console.error('Search failed:', error)
				toast.error('Search failed')
			} finally {
				setIsSearching(false)
			}
		} else {
			setSearchResults([])
		}
	}

	const clearSearch = () => {
		setShowSearch(false)
		setSearchQuery('')
		setSearchResults([])
		searchInputRef.current?.blur()
	}

	return (
		<div className="border-b relative">
			<div className="flex h-12 items-center justify-between px-4">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
						aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						className="h-8 w-8"
					>
						<Menu className="h-4 w-4" />
					</Button>

					<div className="font-semibold">Chat Analytics</div>
				</div>

				<div className="flex items-center gap-2">
					<SettingsDrawer />

					{showSearch ? (
						<div className="relative">
							<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								ref={searchInputRef}
								placeholder="Search messages..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="h-8 w-[200px] pl-8 pr-8"
							/>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
								onClick={clearSearch}
							>
								<X className="h-4 w-4" />
							</Button>

							{/* Search Results Overlay */}
							{searchQuery && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-md shadow-lg overflow-hidden z-50">
									<div className="flex items-center justify-between p-3 border-b">
										<h3 className="text-sm font-medium">Search Results</h3>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={clearSearch}
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
									<div className="max-h-[400px] overflow-y-auto">
										{isSearching ? (
											<div className="p-4 text-center text-muted-foreground">
												Searching...
											</div>
										) : searchResults.length > 0 ? (
											searchResults.map((result, index) => (
												<div
													key={index}
													className="p-3 hover:bg-accent cursor-pointer border-b last:border-0"
												>
													<div className="text-sm">{result.message}</div>
													<div className="text-xs text-muted-foreground mt-1">
														{new Date(result.timestamp).toLocaleString()}
													</div>
												</div>
											))
										) : searchQuery ? (
											<div className="p-4 text-center text-muted-foreground">
												No results found
											</div>
										) : null}
									</div>
								</div>
							)}
						</div>
					) : (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowSearch(true)}
							className="h-8 w-8 relative group"
						>
							<Search className="h-4 w-4" />
							<div className="absolute hidden group-hover:flex right-0 top-full mt-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md p-1.5 whitespace-nowrap items-center gap-1">
								Search
								<Kbd>/</Kbd>
								or
								<Kbd>⌘</Kbd>
								<Kbd>K</Kbd>
							</div>
						</Button>
					)}

					<div className="h-4 w-[1px] bg-border" />

					<Button
						variant="ghost"
						size="icon"
						onClick={toggleRightSidebar}
						className="h-8 w-8"
					>
						<Settings className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
} 
