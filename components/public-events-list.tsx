"use client"

import type { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface PublicEventsListProps {
  events: Event[]
}

export function PublicEventsList({ events }: PublicEventsListProps) {
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (events.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Calendar className="w-12 h-12 text-primary/50" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
        <p className="text-muted-foreground">Check back soon for exciting events!</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm group relative overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </CardTitle>
                  </motion.div>
                  <CardDescription className="mt-3">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-sm font-medium">{formatDate(event.date)}</span>
                    </motion.div>
                  </CardDescription>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Badge
                    variant="secondary"
                    className="flex-shrink-0 text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {event.attendeeCount}
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0 relative z-10">
              {event.location && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="truncate">{event.location}</span>
                </motion.div>
              )}

              {event.description && (
                <motion.p
                  className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {event.description}
                </motion.p>
              )}

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button asChild className="w-full group/btn relative overflow-hidden">
                  <Link href={`/events/${event.id}`} className="flex items-center justify-center gap-2">
                    <span>View Event & RSVP</span>
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Link>
                </Button>
              </motion.div>
            </CardContent>

            {/* Floating particles on hover */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${20 + i * 20}%`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5 + index * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
