"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Check, Settings } from "lucide-react"
import * as React from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Theme definitions
const themes = {
  light: {
    name: "Light",
    preview: "/placeholder.svg?height=100&width=200&text=Light+Theme",
    vars: {
      "--background": "0 0% 100%",
      "--foreground": "240 10% 3.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "240 10% 3.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "240 10% 3.9%",
      "--primary": "240 5.9% 10%",
      "--primary-foreground": "0 0% 98%",
      "--secondary": "240 4.8% 95.9%",
      "--secondary-foreground": "240 5.9% 10%",
      "--muted": "240 4.8% 95.9%",
      "--muted-foreground": "240 3.8% 46.1%",
      "--accent": "240 4.8% 95.9%",
      "--accent-foreground": "240 5.9% 10%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "240 5.9% 90%",
      "--input": "240 5.9% 90%",
      "--ring": "240 5.9% 10%",
    }
  },
  dark: {
    name: "Dark",
    preview: "/placeholder.svg?height=100&width=200&text=Dark+Theme",
    vars: {
      "--background": "240 10% 3.9%",
      "--foreground": "0 0% 98%",
      "--card": "240 10% 3.9%",
      "--card-foreground": "0 0% 98%",
      "--popover": "240 10% 3.9%",
      "--popover-foreground": "0 0% 98%",
      "--primary": "0 0% 98%",
      "--primary-foreground": "240 5.9% 10%",
      "--secondary": "240 3.7% 15.9%",
      "--secondary-foreground": "0 0% 98%",
      "--muted": "240 3.7% 15.9%",
      "--muted-foreground": "240 5% 64.9%",
      "--accent": "240 3.7% 15.9%",
      "--accent-foreground": "0 0% 98%",
      "--destructive": "0 62.8% 30.6%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "240 3.7% 15.9%",
      "--input": "240 3.7% 15.9%",
      "--ring": "240 4.9% 83.9%",
    }
  },
  rose: {
    name: "Rose",
    preview: "/placeholder.svg?height=100&width=200&text=Rose+Theme",
    vars: {
      "--background": "0 95% 98%",
      "--foreground": "0 0% 0%",
      "--card": "0 90% 90%",
      "--card-foreground": "0 0% 0%",
      "--popover": "0 90% 90%",
      "--popover-foreground": "0 0% 0%",
      "--primary": "0 0% 0%",
      "--primary-foreground": "0 0% 90%",
      "--secondary": "0 0% 95%",
      "--secondary-foreground": "0 1% 10%",
      "--muted": "0 0% 90%",
      "--muted-foreground": "0 0% 40%",
      "--accent": "0 0% 95%",
      "--accent-foreground": "0 1% 10%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "0 5% 89%",
      "--input": "0 5% 89%",
      "--ring": "0 0% 0%",
    }
  },
  pink: {
    name: "Light Pink",
    preview: "/placeholder.svg?height=100&width=200&text=Light+Pink+Theme",
    vars: {
      "--background": "269 98.05% 98.42%",
      "--foreground": "269 6.1% 0.84%",
      "--card": "269 41.2% 92.1%",
      "--card-foreground": "269 6.1% 1.05%",
      "--popover": "269 41.2% 92.1%",
      "--popover-foreground": "269 6.1% 1.05%",
      "--primary": "269 61% 21%",
      "--primary-foreground": "269 1.22% 92.1%",
      "--secondary": "269 3.05% 96.05%",
      "--secondary-foreground": "269 4.66% 12.1%",
      "--muted": "269 6.1% 92.1%",
      "--muted-foreground": "269 3.05% 42.1%",
      "--accent": "269 3.05% 96.05%",
      "--accent-foreground": "269 4.66% 12.1%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "269 11.1% 89.84%",
      "--input": "269 11.1% 89.84%",
      "--ring": "269 61% 21%",
    }
  },
  pumpkin: {
    name: "Pumpkin",
    preview: "/placeholder.svg?height=100&width=200&text=Pumpkin+Theme",
    vars: {
      "--background": "30 63.7% 4.24%",
      "--foreground": "30 9.8% 97.65%",
      "--card": "30 45.4% 6.89%",
      "--card-foreground": "30 9.8% 97.65%",
      "--popover": "30 45.4% 6.89%",
      "--popover-foreground": "30 9.8% 97.65%",
      "--primary": "30 98% 53%",
      "--primary-foreground": "30 9.8% 5.3%",
      "--secondary": "30 49% 15.9%",
      "--secondary-foreground": "30 9.8% 97.65%",
      "--muted": "30 49% 15.9%",
      "--muted-foreground": "30 9.8% 55.3%",
      "--accent": "30 49% 15.9%",
      "--accent-foreground": "30 9.8% 97.65%",
      "--destructive": "0 62.8% 30.6%",
      "--destructive-foreground": "30 9.8% 97.65%",
      "--border": "30 49% 15.9%",
      "--input": "30 49% 15.9%",
      "--ring": "30 98% 53%",
    }
  },
  electric: {
    name: "Electric",
    preview: "/placeholder.svg?height=100&width=200&text=Electric+Theme",
    vars: {
      "--background": "64 100% 98.4%",
      "--foreground": "64 10% 0.8%",
      "--card": "64 10% 92%",
      "--card-foreground": "64 10% 1%",
      "--popover": "64 10% 92%",
      "--popover-foreground": "64 10% 1%",
      "--primary": "64 100% 20%",
      "--primary-foreground": "64 2% 92%",
      "--secondary": "64 5% 96%",
      "--secondary-foreground": "64 7% 12%",
      "--muted": "64 10% 92%",
      "--muted-foreground": "64 5% 42%",
      "--accent": "64 5% 96%",
      "--accent-foreground": "64 7% 12%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "64 15% 89.8%",
      "--input": "64 15% 89.8%",
      "--ring": "64 100% 20%",
    }
  }
}

type SettingsStore = {
  theme: keyof typeof themes
  messagesPerPage: number
  sortOrder: 'asc' | 'desc'
  isRightSidebarOpen: boolean
  transparentSidebar: boolean
  setTheme: (theme: keyof typeof themes) => void
  setMessagesPerPage: (count: number) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  toggleRightSidebar: () => void
  setTransparentSidebar: (isTransparent: boolean) => void
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      messagesPerPage: 25,
      sortOrder: 'desc',
      isRightSidebarOpen: false,
      transparentSidebar: false,
      setTheme: (theme) => {
        set({ theme })
        // Apply theme variables to document root
        const root = document.documentElement
        Object.entries(themes[theme].vars).forEach(([key, value]) => {
          root.style.setProperty(key, value)
        })
      },
      setMessagesPerPage: (count) => set({ messagesPerPage: count }),
      setSortOrder: (order) => set({ sortOrder: order }),
      toggleRightSidebar: () => set((state) => ({ 
        isRightSidebarOpen: !state.isRightSidebarOpen 
      })),
      setTransparentSidebar: (isTransparent) => set({ transparentSidebar: isTransparent }),
    }),
    {
      name: "settings-storage",
    }
  )
)

function ThemePreview({ 
  theme, 
  isActive, 
  onClick 
}: { 
  theme: keyof typeof themes
  isActive: boolean
  onClick: () => void 
}) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
        isActive ? 'border-primary' : 'border-transparent hover:border-muted'
      }`}
    >
      {isLoading ? (
        <Skeleton className="w-[200px] h-[100px]" />
      ) : (
        <>
          <img
            src={themes[theme].preview}
            alt={themes[theme].name}
            className="w-[200px] h-[100px] object-cover"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-sm font-medium">{themes[theme].name}</p>
          </div>
          {isActive && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          )}
        </>
      )}
    </button>
  )
}

export default function SettingsDrawer() {
  const {
    theme,
    messagesPerPage,
    sortOrder,
    transparentSidebar,
    setTheme,
    setMessagesPerPage,
    setSortOrder,
    setTransparentSidebar
  } = useSettingsStore()

  const [jumpToPage, setJumpToPage] = React.useState("")
  const [customColor, setCustomColor] = React.useState("#90FB3F")

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value)
    if (!isNaN(newSize)) {
      setMessagesPerPage(newSize)
      window.location.reload()
    }
  }

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as 'asc' | 'desc')
    window.location.reload()
  }

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage)
    if (!isNaN(page) && page > 0) {
      // Implement page navigation logic here
      console.log(`Jumping to page ${page}`)
      setJumpToPage("")
    }
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value)
    document.documentElement.style.setProperty('--primary', e.target.value)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
          <span className="absolute hidden group-hover:inline-flex right-0 top-0 -mt-1 -mr-1 h-3 w-3 rounded-full bg-primary"></span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Appearance</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label className="text-base">Interface theme</Label>
            <p className="text-sm text-muted-foreground">
              Customize your workspace theme
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {Object.keys(themes).map((themeKey) => (
                <ThemePreview
                  key={themeKey}
                  theme={themeKey as keyof typeof themes}
                  isActive={theme === themeKey}
                  onClick={() => setTheme(themeKey as keyof typeof themes)}
                />
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label className="text-base">Customize primary color</Label>
            <p className="text-sm text-muted-foreground">
              Customize the look of your workspace. Feeling adventurous?
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-10 p-1 rounded-md"
              />
              <Input
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-24"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Transparent sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Add a transparency layer to your sidebar
              </p>
            </div>
            <Switch
              checked={transparentSidebar}
              onCheckedChange={setTransparentSidebar}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Select 
              value={sortOrder}
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          <div className="space-y-2">
            <Label>Messages per page</Label>
            <Select 
              value={String(messagesPerPage)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select messages per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Jump to page</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                min="1"
                placeholder="Page number"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
              />
              <Button onClick={handleJumpToPage}>
                Jump
              </Button>
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
