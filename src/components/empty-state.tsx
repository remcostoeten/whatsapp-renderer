'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

function BackgroundSquare({
	size = 'md',
	position,
	index
}: {
	size?: 'sm' | 'md' | 'lg'
	position: { top: number; left: number; rotate: number }
	index: number
}) {
	const sizes = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16'
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{
				opacity: 0.05,
				scale: 1,
				rotate: position.rotate
			}}
			transition={{
				duration: 2,
				delay: index * 0.1
			}}
			className={`absolute ${sizes[size]} bg-zinc-800 rounded-md transform`}
			style={{
				top: `${position.top}%`,
				left: `${position.left}%`,
				rotate: `${position.rotate}deg`
			}}
		/>
	)
}

function ScatteredBackground() {
	const squares = Array.from({ length: 25 }, (_, i) => ({
		size: i % 3 === 0 ? 'lg' : i % 2 === 0 ? 'md' : 'sm',
		position: {
			top: Math.random() * 150 - 25, // This allows squares to be slightly off-screen
			left: Math.random() * 150 - 25, // This allows squares to be slightly off-screen
			rotate: Math.random() * 360
		}
	}))

	return (
		<div className="absolute inset-0 overflow-hidden">
			{squares.map((square, i) => (
				<BackgroundSquare
					key={i}
					index={i}
					size={square.size}
					position={square.position}
				/>
			))}
		</div>
	)
}

function FloatingCard({
	children,
	delay,
	offset,
	mouseX,
	mouseY
}: {
	children: React.ReactNode
	delay: number
	offset: { x: number; y: number; rotate: number }
	mouseX: number
	mouseY: number
}) {
	const springConfig = { damping: 20, stiffness: 200 }
	const x = useSpring(useMotionValue(0), springConfig)
	const y = useSpring(useMotionValue(0), springConfig)
	const rotate = useSpring(useMotionValue(0), springConfig)

	// Random factor to make each card behave slightly differently
	const [randomFactor] = useState(() => Math.random() * 2 - 1) // between -1 and 1

	useEffect(() => {
		const maxDistance = 100 // maximum distance for interaction
		const strength = 15 // strength of the effect

		function updatePosition(ref: HTMLDivElement | null) {
			if (!ref) return

			const rect = ref.getBoundingClientRect()
			const cardCenterX = rect.left + rect.width / 2
			const cardCenterY = rect.top + rect.height / 2

			// Calculate distance between mouse and card center
			const deltaX = mouseX - cardCenterX
			const deltaY = mouseY - cardCenterY
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

			// If mouse is within range
			if (distance < maxDistance) {
				const factor = 1 - distance / maxDistance
				// Randomize the direction (attract or repel) and add some variation
				const directionX =
					(deltaX * factor * strength * randomFactor) / distance
				const directionY =
					(deltaY * factor * strength * randomFactor) / distance

				x.set(directionX)
				y.set(directionY)
				rotate.set(directionX * 0.2) // subtle rotation based on movement
			} else {
				// Return to original position
				x.set(0)
				y.set(0)
				rotate.set(0)
			}
		}

		const ref = document.getElementById(`floating-card-${delay}`)
		updatePosition(ref as HTMLDivElement)
	}, [mouseX, mouseY, x, y, rotate, randomFactor, delay])

	return (
		<motion.div
			id={`floating-card-${delay}`}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{
				opacity: 1,
				y: [offset.y, offset.y - 10, offset.y],
				x: [offset.x, offset.x + 5, offset.x]
			}}
			style={{
				x,
				y,
				rotate
			}}
			transition={{
				opacity: { duration: 0.5, delay },
				scale: { duration: 0.5, delay },
				default: {
					duration: 3,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
					delay: delay + Math.random()
				}
			}}
			className="mb-6 last:mb-0"
		>
			<div className="relative">
				<div className="absolute inset-0 bg-zinc-800/20 rounded-xl transform translate-x-2 translate-y-2" />
				<div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-5 flex justify-between items-start min-w-[320px]">
					<div className="space-y-3">
						<motion.div
							className="h-2 bg-zinc-700 rounded-full w-32"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: delay + 0.2, duration: 0.5 }}
						/>
						<motion.div
							className="h-2 bg-zinc-700 rounded-full w-24"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: delay + 0.3, duration: 0.5 }}
						/>
					</div>
					{children}
				</div>
			</div>
		</motion.div>
	)
}

function Badge({
	left,
	right,
	gradient
}: {
	left: string
	right: string
	gradient: string
}) {
	return (
		<motion.div
			className="flex items-center"
			style={{
				background: gradient,
				padding: '2px',
				borderRadius: '999px'
			}}
			whileHover={{ scale: 1.05 }}
		>
			<div className="flex -space-x-1">
				<div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white backdrop-blur-sm">
					{left}
				</div>
				<div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white backdrop-blur-sm">
					{right}
				</div>
			</div>
		</motion.div>
	)
}

export default function EmptyState() {
	const [mouseX, setMouseX] = useState(0)
	const [mouseY, setMouseY] = useState(0)

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMouseX(e.clientX)
			setMouseY(e.clientY)
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [])

	return (
		<div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 overflow-hidden">
			<div className="relative w-full max-w-4xl">
				<ScatteredBackground />

				{/* Centered content container */}
				<div className="flex flex-col items-center justify-center">
					{/* Floating cards in a vertical stack */}
					<div className="mb-20">
						<FloatingCard
							delay={0.1}
							offset={{ x: 0, y: 0, rotate: -3 }}
							mouseX={mouseX}
							mouseY={mouseY}
						>
							<Badge
								left="RI"
								right="PL"
								gradient="linear-gradient(90deg, rgb(255, 138, 76), rgb(139, 227, 173))"
							/>
						</FloatingCard>
						<FloatingCard
							delay={0.2}
							offset={{ x: 0, y: 0, rotate: 2 }}
							mouseX={mouseX}
							mouseY={mouseY}
						>
							<Badge
								left="VL"
								right="SS"
								gradient="linear-gradient(90deg, rgb(233, 109, 233), rgb(99, 179, 237))"
							/>
						</FloatingCard>
						<FloatingCard
							delay={0.3}
							offset={{ x: 0, y: 0, rotate: -2 }}
							mouseX={mouseX}
							mouseY={mouseY}
						>
							<Badge
								left="YD"
								right="AB"
								gradient="linear-gradient(90deg, rgb(129, 230, 149), rgb(248, 113, 113))"
							/>
						</FloatingCard>
					</div>

					{/* Text and button */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="text-center relative z-10"
					>
						<motion.h2
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, duration: 0.5 }}
							className="text-4xl font-bold text-white mb-6"
						>
							Start by creating a group
						</motion.h2>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.2, duration: 0.5 }}
							className="text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed text-lg"
						>
							Creating a group makes working in teams easier.
							Share content with the people who need it and find
							content where you need it. Just like that.
						</motion.p>
						<motion.button
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1.4, duration: 0.3 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-800/50 text-white font-medium border border-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
						>
							<Plus className="w-5 h-5" />
							Create a group
						</motion.button>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
