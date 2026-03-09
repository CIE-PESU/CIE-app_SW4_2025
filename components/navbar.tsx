"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, LogOut, User, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from 'next-themes'
import { NotificationDropdown } from "@/components/ui/notification-dropdown"
import { useNotifications } from "@/components/notification-provider"

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  onPageChange: (page: string) => void
}

export function Navbar({ sidebarOpen, setSidebarOpen, sidebarCollapsed, onPageChange }: NavbarProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { activities, loading } = useNotifications()

  const handleSignOut = () => {
    logout()
  }

  return (
    <div
      className={cn(
        "fixed top-0 right-0 left-0 h-20 bg-[#e3f0ff] dark:bg-dark4 border-b border-gray-200 dark:border-dark3 z-30 transition-all duration-300",
        sidebarCollapsed ? "lg:left-16" : "lg:left-64",
      )}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-end flex-1">
          {/* Dark mode toggle button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <NotificationDropdown activities={activities} loading={loading} onPageChange={onPageChange} />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 px-3 rounded-full flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground dark:text-white">
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : ''}
                    </p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user?.role === 'FACULTY' && (user as any)?.profileData?.faculty_id ? `/profile-img/${(user as any).profileData.faculty_id}.jpg` : undefined}
                      alt={user?.name || 'User avatar'}
                      onError={(e) => {
                        // Try different extensions if jpg fails
                        const currentSrc = e.currentTarget.src;
                        if (currentSrc.includes('.jpg')) {
                          e.currentTarget.src = currentSrc.replace('.jpg', '.jpeg');
                        } else if (currentSrc.includes('.jpeg')) {
                          e.currentTarget.src = currentSrc.replace('.jpeg', '.png');
                        }
                      }}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem onClick={() => onPageChange('profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Sign Out Button */}
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
