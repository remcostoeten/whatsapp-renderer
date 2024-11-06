'use client'

export default function Loader() {
	return (
		<div className="loading">
			<svg width="64px" height="48px">
				<polyline
					points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
					id="back"
				></polyline>
				<polyline
					points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
					id="front"
				></polyline>
			</svg>
		</div>
	)
}

type LoaderWithTextProps = {
	text: string
}

export function LoaderWithText({ text }: LoaderWithTextProps) {
	return (
		<div className="grid w-screen h-screen place-items-center">
			{' '}
			<div className="flex flex-col items-center justify-center  gap-2">
				<Loader />
				<p className="text-sm text-muted-foreground">{text}</p>
			</div>
		</div>
	)
}
