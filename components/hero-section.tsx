"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Calendar, Users, Zap } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
export function HeroSection() {
  const { user } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content Section */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 mx-auto lg:mx-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4" />
                <span>New & Improved</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
                variants={itemVariants}
              >
                <span className="block">Simplify Your</span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Event Management
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-lg blur opacity-75"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                variants={itemVariants}
              >
                EventEase helps you create, manage, and track events with ease. From RSVPs to attendee management, we've
                got you covered with powerful tools and beautiful interfaces.
              </motion.p>
            </motion.div>

            {!user ? (<motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group relative overflow-hidden px-8 py-6 text-lg"
                >
                  <Link href="/register" className="flex items-center gap-3">
                    <span>Get Started</span>
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ArrowRight className="w-5 h-5" />
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

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto group border-2 hover:border-primary/50 relative overflow-hidden px-8 py-6 text-lg"
                >
                  <Link href="/events" className="flex items-center gap-3">
                    <span>Browse Events</span>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Calendar className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>) : null}
          </div>

          {/* Visual Section */}
          <motion.div className="flex items-center justify-center order-first lg:order-last" variants={itemVariants}>
            <motion.div
              className="relative w-full max-w-lg h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-24 sm:h-32 lg:h-40 rounded-xl bg-background/80 p-4 shadow-lg border border-border/50 backdrop-blur-sm"
                      variants={floatingVariants}
                      animate="animate"
                      transition={{ delay: i * 0.2 }}
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.div
                        className="h-4 w-3/4 rounded bg-gradient-to-r from-primary/30 to-purple-600/30 mb-3"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.3,
                        }}
                      />
                      <motion.div
                        className="h-3 w-1/2 rounded bg-muted-foreground/20 mb-2"
                        animate={{
                          width: ["50%", "70%", "50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.4,
                        }}
                      />
                      <motion.div
                        className="h-3 w-5/6 rounded bg-muted-foreground/20"
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.5,
                        }}
                      />

                      {/* Floating icons */}
                      <motion.div
                        className="absolute top-2 right-2"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.6,
                        }}
                      >
                        {i === 0 && <Calendar className="w-4 h-4 text-primary/50" />}
                        {i === 1 && <Users className="w-4 h-4 text-purple-500/50" />}
                        {i === 2 && <Sparkles className="w-4 h-4 text-primary/50" />}
                        {i === 3 && <Zap className="w-4 h-4 text-purple-500/50" />}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${25 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
