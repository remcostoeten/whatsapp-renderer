'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { searchMessages } from '@/features/chat/actions'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
interface SearchResult {
	index: number
	message: string
	timestamp: string
}

interface SearchBarProps {
	chatId: string
}

export function SearchBar({ chatId }: SearchBarProps) {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResult[]>([])
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const router = useRouter()
	const searchRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsSearchOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!query.trim()) return

		const searchResults = await searchMessages(chatId, query)
		setResults(searchResults)
		setIsSearchOpen(true)
	}

	const jumpToMessage = (index: number) => {
		const page = Math.floor(index / 30) + 1
		router.push(`/chats/${chatId}?page=${page}&highlight=${index}`)
		setIsSearchOpen(false)
	}

	const closeSearch = () => {
		setIsSearchOpen(false)
		setResults([])
		setQuery('')
	}

	return (
		<div ref={searchRef} className="relative w-full max-w-md">
			<form onSubmit={handleSearch} className="relative">
				<Input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search messages..."
					className="w-full pr-10"
				/>
				<Button
					type="submit"
					variant="ghost"
					size="icon"
					className="absolute right-0 top-0 h-full px-3"
				>
					<Search className="h-4 w-4" />
				</Button>
			</form>
			<AnimatePresence>
				{isSearchOpen && results.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute z-50 w-full mt-2 bg-popover rounded-md shadow-lg overflow-hidden"
					>
						<div className="flex justify-between items-center p-2 border-b">
							<span className="text-sm font-medium">
								Search Results
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={closeSearch}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
						<ScrollArea className="max-h-60">
							{results.map((result, index) => (
								<div
									key={index}
									className="cursor-pointer hover:bg-muted p-3 transition-colors"
									onClick={() => jumpToMessage(result.index)}
								>
									<p className="text-sm line-clamp-2">
										{result.message}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{new Date(
											result.timestamp
										).toLocaleString()}
									</p>
								</div>
							))}
						</ScrollArea>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
