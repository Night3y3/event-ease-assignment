"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { CalendarDays, Users, Settings, LayoutDashboard, PlusCircle, UserCog } from "lucide-react"

interface DashboardNavProps {
  user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: CalendarDays,
    },
    {
      title: "Attendees",
      href: "/dashboard/attendees",
      icon: Users,
    },
  ]

  if (user.role === "ADMIN") {
    navItems.push(
      {
        title: "User Management",
        href: "/dashboard/users",
        icon: UserCog,
      }
    )
  }

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Link key={index} href={item.href}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </span>
          </Link>
        )
      })}
      <Button asChild className="mt-4 w-full hidden sm:flex">
        <Link href="/dashboard/events/new">
          <PlusCircle className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Create Event</span>
        </Link>
      </Button>
    </nav>
  )
}
