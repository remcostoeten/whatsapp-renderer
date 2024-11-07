'use client'

import { cn } from '@/lib/utils'
import PageSizeSelector from './page-size-selector'
import Pagination from './pagination'

type PaginationToolbarProps = {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  className?: string
  isLoading?: boolean
}

export default function PaginationToolbar({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  isLoading
}: PaginationToolbarProps) {
  return (
    <div className={cn('flex items-center justify-between p-4', className)}>
      <PageSizeSelector 
        pageSize={pageSize} 
        onPageSizeChange={onPageSizeChange} 
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        className="ml-auto"
      />
    </div>
  )
} 
