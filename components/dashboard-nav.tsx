"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { CalendarDays, Users, Settings, LayoutDashboard, PlusCircle, UserCog } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: CalendarDays,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Attendees",
      href: "/dashboard/attendees",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  // Add admin-only navigation items
  if (user.role === "ADMIN") {
    navItems.push(
      {
        title: "User Management",
        href: "/dashboard/users",
        icon: UserCog,
        gradient: "from-orange-500 to-red-500",
      }
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.nav className="grid items-start gap-2" variants={containerVariants} initial="hidden" animate="visible">
      {navItems.map((item, index) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href={item.href}>
              <motion.div
                className={cn(
                  "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border border-primary/20"
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground",
                )}
                whileHover={{ backgroundColor: isActive ? undefined : "hsl(var(--accent))" }}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-600 rounded-r-full"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with gradient background on active */}
                <motion.div
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 rounded-md flex items-center justify-center transition-all duration-300",
                    isActive ? `bg-gradient-to-r ${item.gradient}` : "",
                  )}
                  whileHover={{
                    scale: 1.1,
                    rotate: isActive ? 0 : 5,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
                </motion.div>

                <span className="truncate">{item.title}</span>

                {/* Hover effect background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 rounded-lg"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Active background animation */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </motion.div>
        )
      })}

      {/* Create Event Button */}
      <motion.div
        className="mt-6"
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          asChild
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 relative overflow-hidden group"
        >
          <Link href="/dashboard/events/new" className="flex items-center justify-center gap-2">
            <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <PlusCircle className="h-4 w-4 flex-shrink-0" />
            </motion.div>
            <span className="truncate">Create Event</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Link>
        </Button>
      </motion.div>
    </motion.nav>
  )
}
