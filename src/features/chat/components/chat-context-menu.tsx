'use client'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from '@/components/ui/context-menu'
import { FileText, Info, Star, Trash } from 'lucide-react'

type ChatContextMenuProps = {
	children: React.ReactNode
	onViewInfo?: () => void
	onExport?: () => void
	onDelete?: () => void
	onToggleFavorite?: () => void
	isFavorite?: boolean
}

export default function ChatContextMenu({
	children,
	onViewInfo,
	onExport,
	onDelete,
	onToggleFavorite,
	isFavorite = false
}: ChatContextMenuProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className="w-16">
				<ContextMenuItem onClick={onViewInfo}>
					<Info className="mr-2 h-4 w-4" />
					View Info
				</ContextMenuItem>
				<ContextMenuItem onClick={onExport}>
					<FileText className="mr-2 h-4 w-4" />
					Export Chat
				</ContextMenuItem>
				<ContextMenuItem onClick={onToggleFavorite}>
					<Star
						className="mr-2 h-4 w-4"
						fill={isFavorite ? 'currentColor' : 'none'}
					/>
					{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
				</ContextMenuItem>
				<ContextMenuItem onClick={onDelete} className="text-red-600">
					<Trash className="mr-2 h-4 w-4" />
					Delete Chat
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	)
}
