'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { useSettingsStore } from '@/features/store/settings-store'
import { Monitor, Moon, Settings, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type ChatStats = {
  totalMessages: number
  createdAt: string
  lastMessageAt: string
}

export default function RightSidebar() {
  const [chatStats, setChatStats] = useState<ChatStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const chatId = pathname.split('/').pop() // Get chatId from URL

  const {
    theme,
    setTheme,
    pageSize,
    setPageSize,
    showTimestamps,
    setShowTimestamps,
    showAvatars,
    setShowAvatars,
    messageAlignment,
    setMessageAlignment,
    isRightSidebarOpen,
    toggleRightSidebar,
  } = useSettingsStore()

  const { setTheme: setNextTheme } = useTheme()

  useEffect(() => {
    const fetchChatStats = async () => {
      if (!chatId) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/chats/${chatId}/stats`)
        const data = await response.json()
        setChatStats(data)
      } catch (error) {
        console.error('Failed to fetch chat stats:', error)
        toast.error('Failed to load chat statistics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatStats()
  }, [chatId])

  // Handle theme changes
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setNextTheme(newTheme)

    const messages = {
      light: '☀️ Light theme activated',
      dark: '🌙 Dark theme activated',
      system: '💻 System theme activated'
    }

    toast.success(messages[newTheme], {
      position: 'bottom-right',
      duration: 2000,
    })
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'timestamps':
        setShowTimestamps(value)
        toast.success(`Timestamps ${value ? 'shown' : 'hidden'}`)
        break
      case 'avatars':
        setShowAvatars(value)
        toast.success(`Avatars ${value ? 'shown' : 'hidden'}`)
        break
    }
  }

  const handleAlignmentChange = (alignment: 'left' | 'right') => {
    setMessageAlignment(alignment)
    toast.success(`Messages aligned to ${alignment}`)
  }

  const handlePageSizeChange = (value: string) => {
    const size = Number(value)
    setPageSize(size)
    toast.success(`Page size set to ${size} messages`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' years ago'
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' months ago'
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' days ago'
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' hours ago'
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutes ago'
    return Math.floor(seconds) + ' seconds ago'
  }

  return (
    <Sheet open={isRightSidebarOpen} onOpenChange={toggleRightSidebar}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Chat Settings</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full py-4">
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Theme</h4>
              <div className="flex items-center gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="w-full"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="w-full"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('system')}
                  className="w-full"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </Button>
              </div>
            </div>

            <Separator />

            {/* Pagination Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Pagination</h4>
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 75, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} messages per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Display Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Display</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-timestamps">Show Timestamps</Label>
                  <Switch
                    id="show-timestamps"
                    checked={showTimestamps}
                    onCheckedChange={(checked) => handleSettingChange('timestamps', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-avatars">Show Avatars</Label>
                  <Switch
                    id="show-avatars"
                    checked={showAvatars}
                    onCheckedChange={(checked) => handleSettingChange('avatars', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Alignment</Label>
                  <Select
                    value={messageAlignment}
                    onValueChange={handleAlignmentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Chat Info */}
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Chat Information</h4>
              <div className="rounded-lg border p-4 space-y-2">
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ) : chatStats ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Messages</span>
                      <span className="text-sm font-medium">{chatStats.totalMessages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm font-medium">{formatDate(chatStats.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Message</span>
                      <span className="text-sm font-medium">{formatTimeAgo(chatStats.lastMessageAt)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center">
                    No chat selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 
