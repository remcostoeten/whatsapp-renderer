'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

type PageSizeSelectorProps = {
	pageSize: number
	onPageSizeChange: (size: number) => void
}

const pageSizeOptions = [10, 25, 50, 75, 100] as const

export default function PageSizeSelector({
	pageSize,
	onPageSizeChange
}: PageSizeSelectorProps) {
	const value = String(pageSize || 25)

	const handleValueChange = (newValue: string) => {
		const size = Number(newValue)
		if (!isNaN(size) && onPageSizeChange) {
			onPageSizeChange(size)
		}
	}

	return (
		<Select
			value={value}
			onValueChange={handleValueChange}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={`${value} items per page`} />
			</SelectTrigger>
			<SelectContent>
				{pageSizeOptions.map((size) => (
					<SelectItem key={size} value={String(size)}>
						{size} items per page
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
