'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type PaginationProps = {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	isLoading?: boolean
	className?: string
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	isLoading,
	className
}: PaginationProps) {
	const [jumpToPage, setJumpToPage] = useState('')
	
	// Ensure we have valid numbers
	const current = Math.max(1, currentPage)
	const total = Math.max(1, totalPages || 1)

	const handleJumpToPage = (e: React.FormEvent) => {
		e.preventDefault()
		const pageNumber = Number(jumpToPage)
		if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= total) {
			onPageChange(pageNumber)
			setJumpToPage('')
		}
	}

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages = []
		const maxVisible = 3 // Reduced from 5 to 3 visible page buttons

		if (total <= maxVisible) {
			// Show all pages if total is less than maxVisible
			for (let i = 1; i <= total; i++) {
				pages.push(i)
			}
		} else {
			// Always show first page
			pages.push(1)

			let startPage = Math.max(2, current - 1)
			let endPage = Math.min(total - 1, current + 1)

			// Add ellipsis after first page if needed
			if (startPage > 2) {
				pages.push(-1) // Use number instead of string for ellipsis
			}

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i)
			}

			// Add ellipsis before last page if needed
			if (endPage < total - 1) {
				pages.push(-2) // Use different number for second ellipsis
			}

			// Always show last page
			pages.push(total)
		}

		return pages
	}

	return (
		<div className={cn('flex items-center gap-1', className)}>
			<Button
				onClick={() => onPageChange(current - 1)}
				disabled={current <= 1 || isLoading}
				className="h-7 w-7 p-0"
				variant="ghost"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<div className="flex items-center gap-0.5">
				{getPageNumbers().map((page, index) =>
					page < 0 ? (
						<span key={index} className="px-1 text-sm text-muted-foreground">
							...
						</span>
					) : (
						<Button
							key={index}
							onClick={() => onPageChange(page)}
							disabled={isLoading || page === current}
							variant={page === current ? "default" : "ghost"}
							className={cn(
								'h-7 min-w-[1.75rem] px-2 text-sm',
								page === current &&
									'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
							)}
						>
							{page}
						</Button>
					)
				)}
			</div>

			<Button
				onClick={() => onPageChange(current + 1)}
				disabled={current >= total || isLoading}
				className="h-7 w-7 p-0"
				variant="ghost"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>

			<form onSubmit={handleJumpToPage} className="flex items-center gap-1 ml-2">
				<Input
					type="number"
					min={1}
					max={total}
					value={jumpToPage}
					onChange={(e) => setJumpToPage(e.target.value)}
					placeholder="Page"
					className="h-7 w-14 text-center text-sm px-1"
				/>
				<Button 
					type="submit"
					disabled={isLoading}
					className="h-7 px-2 text-sm"
					variant="ghost"
				>
					Go
				</Button>
			</form>
		</div>
	)
}
