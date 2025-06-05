"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = () => (
    <>
      {user && (<Link
        href="/"
        className="text-sm font-medium hover:text-primary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>)}
      {user && (
        <Link
          href="/dashboard"
          className="text-sm font-medium hover:text-primary transition-colors"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
      )}
      {user && (<Link
        href="/events"
        className="text-sm font-medium hover:text-primary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Events
      </Link>)}
    </>
  )

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EventEase</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItems />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          {!isLoading && user && <UserNav user={user} />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-4">
                <NavItems />
                {!isLoading && !user && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                    <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild onClick={() => setIsOpen(false)}>
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
