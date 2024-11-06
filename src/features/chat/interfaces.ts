export interface Message {
	id: number
	name: string
	message: string
	timestamp: string
	attachment?: string
}

export interface ChatMessagesResponse {
	messages: Message[]
	totalCount: number
}

export interface ChatStatistics {
	overview: {
		messageCount: number
		participantCount: number
		durationDays: number
		avgMessagesPerDay: number
		firstMessageDate: string
		lastMessageDate: string
	}
	activity: {
		hourlyActivity: { hour: number; count: number }[]
		mostActiveHour: number
		mostActiveDay: string
	}
	participants: {
		name: string
		messageCount: number
		avgMessageLength: number
		longestMessage: number
		shortestMessage: number
	}[]
	content: {
		avgMessageLength: number
		totalCharacters: number
		attachmentCount: number
		shortMessages: number
		longMessages: number
	}
}
