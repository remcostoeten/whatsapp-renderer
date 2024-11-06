import { ChatSkeleton } from '@/components/ui'

export default function Loading() {
	return (
		<div className="space-y-2">
			{Array.from({ length: 10 }).map((_, i) => (
				<ChatSkeleton key={i} />
			))}
		</div>
	)
}
