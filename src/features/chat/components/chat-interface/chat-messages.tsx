'use client'

import { LoaderWithText } from '@/components/loader'
import PaginationToolbar from '@/components/ui/pagination-toolbar'
import { useSettingsStore } from '@/features/store/settings-store'
import { useEffect, useState } from 'react'
import { getChatMessages } from '../../actions/get-chat-messages'

type Message = {
  id: string
  name: string
  message: string
  timestamp: Date
  attachment: string | null
}

type ChatMessagesProps = {
  chatId: string
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalMessages, setTotalMessages] = useState(0)
  
  const pageSize = useSettingsStore((state) => state.pageSize)
  const setPageSize = useSettingsStore((state) => state.setPageSize)

  const totalPages = Math.max(1, Math.ceil(totalMessages / pageSize))

  useEffect(() => {
    if (chatId) {
      loadMessages()
    }
  }, [chatId, page, pageSize])

  async function loadMessages() {
    try {
      setIsLoading(true)
      const response = await getChatMessages(chatId, page, pageSize)
      
      const formattedMessages = response.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        attachment: msg.attachment || null
      }))
      
      setMessages(formattedMessages)
      setTotalMessages(response.totalCount)
      
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    if (setPageSize && newSize !== pageSize) {
      setPageSize(newSize)
      setPage(1)
    }
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {!messages.length && !isLoading ? (
          <div className="text-muted-foreground">No messages found</div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.name === "Remco"
            
            return (
              <div 
                key={message.id} 
                className={`flex flex-col gap-1 max-w-[80%] mb-4 ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`p-4 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-muted rounded-bl-none'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium">{message.name}</span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{message.message}</p>
                  {message.attachment && (
                    <a 
                      href={message.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline mt-2 block"
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
      
      <div className="sticky bottom-0 bg-background border-t">
        <PaginationToolbar
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
        
        {isLoading && (
          <div className="p-4">
            <LoaderWithText text="Loading messages..." />
          </div>
        )}
      </div>
    </div>
  )
}
