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