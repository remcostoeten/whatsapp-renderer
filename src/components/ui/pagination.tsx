'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  // Ensure we have valid numbers
  const current = Math.max(1, currentPage)
  const total = Math.max(1, totalPages || 1)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // Maximum number of visible page buttons
    
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
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        onClick={() => onPageChange(current - 1)}
        disabled={current <= 1 || isLoading}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          page < 0 ? (
            <span key={index} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => onPageChange(page)}
              disabled={isLoading || page === current}
              className={cn(
                "h-8 min-w-[2rem] px-3",
                page === current && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              {page}
            </Button>
          )
        ))}
      </div>

      <Button
        onClick={() => onPageChange(current + 1)}
        disabled={current >= total || isLoading}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
