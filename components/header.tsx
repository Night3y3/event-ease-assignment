"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  const { user, isLoading } = useAuth()

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EventEase</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
          )}
          {user && (
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
          )}
          {user && (
            <Link href="/events" className="text-sm font-medium">
              Events
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!isLoading && !user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : (
            !isLoading && <UserNav user={user} />
          )}
        </div>
      </div>
    </header>
  )
}
