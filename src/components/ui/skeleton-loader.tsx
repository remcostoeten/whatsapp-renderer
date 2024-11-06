'use client'

import { cn } from '@/lib/utils'

type SkeletonProps = {
	className?: string
}

export function Skeleton({ className }: SkeletonProps) {
	return (
		<div className={cn('animate-pulse rounded-md bg-muted', className)} />
	)
}

export function ChatSkeleton() {
	return (
		<div className="flex items-center space-x-4 p-4">
			<Skeleton className="h-10 w-10 rounded-full" />
			<div className="space-y-2 flex-1">
				<Skeleton className="h-4 w-[30%]" />
				<Skeleton className="h-3 w-[60%]" />
			</div>
		</div>
	)
}

export function StatCardSkeleton() {
	return (
		<div className="rounded-xl border bg-card p-6 shadow">
			<div className="flex items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-4 w-[30%]" />
				<Skeleton className="h-4 w-4" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-6 w-[40%]" />
				<Skeleton className="h-3 w-[60%]" />
			</div>
		</div>
	)
}

export function ChartSkeleton() {
	return (
		<div className="rounded-xl border bg-card shadow">
			<div className="p-6">
				<Skeleton className="h-6 w-[30%] mb-4" />
				<div className="space-y-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2">
							<Skeleton
								className="h-8"
								style={{ width: `${Math.random() * 50 + 50}%` }}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
