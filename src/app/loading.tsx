import { ChartSkeleton, StatCardSkeleton } from '@/components/ui'

export default function Loading() {
	return (
		<div className="p-8 space-y-8">
			<div className="h-9 w-[250px] animate-pulse rounded-md bg-muted" />

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<StatCardSkeleton key={i} />
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<ChartSkeleton />
				<ChartSkeleton />
			</div>
		</div>
	)
}
