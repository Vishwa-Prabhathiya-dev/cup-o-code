'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Coffee, LogOut, User } from 'lucide-react'

export function Header({ userName, gender }: { userName: string, gender: string }) {
  const [avatarUrl, setAvatarUrl] = useState('https://ui.shadcn.com/avatars/04.png')

  useEffect(() => {
    switch (gender) {
      case 'Male':
          setAvatarUrl('https://ui.shadcn.com/avatars/02.png')
          break;
      case 'Female':
          setAvatarUrl('https://ui.shadcn.com/avatars/05.png')
          break;
      default:
          setAvatarUrl('https://ui.shadcn.com/avatars/04.png')
          break;
    }
  }, [gender])

  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Coffee className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold">Brew Board</span>
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt={userName} />
                      <AvatarFallback className="bg-accent text-accent-foreground">{userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild onClick={() => signOut({ callbackUrl: '/login' })}>
                    <div>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}