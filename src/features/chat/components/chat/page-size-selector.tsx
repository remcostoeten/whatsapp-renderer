'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type PageSizeSelectorProps = {
	pageSize: number
	onPageSizeChange: (size: number) => void
}

const pageSizeOptions = [10, 25, 50, 75, 100]

export default function PageSizeSelector({
	pageSize,
	onPageSizeChange
}: PageSizeSelectorProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{pageSize} messages per page</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{pageSizeOptions.map((size) => (
					<DropdownMenuItem
						key={size}
						onClick={() => onPageSizeChange(size)}
					>
						{size} messages per page
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
