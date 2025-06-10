"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Animation variants for better performance
const animationVariants = {
  item: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  underline: {
    initial: { width: 0, left: '50%' },
    hover: { width: '100%', left: 0 },
  },
  header: {
    initial: { y: -100 },
    animate: { y: 0 },
  },
  mobileNav: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  authButtons: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  userNav: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }
}

// Reusable NavLink component
const NavLink = ({ href, children, onClick, layoutId }) => (
  <motion.div
    variants={animationVariants.item}
    whileHover="hover"
    whileTap="tap"
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Link
      href={href}
      className="text-sm font-medium hover:text-primary transition-colors duration-300 whitespace-nowrap relative group py-2 px-3 rounded-md block"
      onClick={onClick}
    >
      {children}
      <motion.div
        className="absolute -bottom-1 bg-primary h-0.5"
        variants={animationVariants.underline}
        initial="initial"
        whileHover="hover"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        layoutId={layoutId}
      />
    </Link>
  </motion.div>
)

// Loading skeleton component
const LoadingSkeleton = () => (
  <motion.div
    key="loading"
    variants={animationVariants.userNav}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex items-center gap-2"
  >
    {[16, 20].map((width, index) => (
      <motion.div
        key={index}
        className={`w-${width} h-9 bg-gradient-to-r from-muted to-muted/50 rounded-md`}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay: index * 0.2,
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    ))}
  </motion.div>
)

// Auth buttons component
const AuthButtons = ({ onClose, isMobile = false }) => (
  <motion.div
    key="auth-buttons"
    variants={animationVariants.authButtons}
    initial="initial"
    animate="animate"
    exit="exit"
    className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full mt-6 pt-6 border-t' : ''}`}
  >
    <motion.div
      whileHover={{ scale: 1.05, y: isMobile ? 0 : -2, x: isMobile ? 5 : 0 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={isMobile ? 'w-full' : ''}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`relative overflow-hidden group ${isMobile ? 'w-full justify-start' : ''}`}
        asChild
        onClick={onClose}
      >
        <Link href="/login">
          <motion.span className="relative z-10">Login</motion.span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
        </Link>
      </Button>
    </motion.div>
    <motion.div
      whileHover={{ scale: 1.05, y: isMobile ? 0 : -2, x: isMobile ? 5 : 0 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={isMobile ? 'w-full' : ''}
    >
      <Button
        size="sm"
        className={`relative overflow-hidden group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 ${isMobile ? 'w-full' : ''}`}
        asChild
        onClick={onClose}
      >
        <Link href="/register">
          <motion.span className="relative z-10">Register</motion.span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
      </Button>
    </motion.div>
  </motion.div>
)

export function Header() {
  const { user, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Memoized close handler
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Memoized navigation items
  const NavItems = useMemo(() => ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} items-center gap-4 md:gap-6`}>
      <NavLink
        href="/"
        onClick={handleClose}
        layoutId={`nav-underline-home-${isMobile ? 'mobile' : 'desktop'}`}
      >
        Home
      </NavLink>

      <AnimatePresence mode="wait">
        {user && (
          <motion.div
            key="dashboard-nav"
            variants={animationVariants.item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <NavLink
              href="/dashboard"
              onClick={handleClose}
              layoutId={`nav-underline-dashboard-${isMobile ? 'mobile' : 'desktop'}`}
            >
              Dashboard
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>

      <NavLink
        href="/events"
        onClick={handleClose}
        layoutId={`nav-underline-events-${isMobile ? 'mobile' : 'desktop'}`}
      >
        Events
      </NavLink>
    </div>
  ), [user, handleClose])

  // Memoized header class
  const headerClass = useMemo(() =>
    `border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 w-full transition-all duration-500 ${scrolled ? "shadow-lg border-border/50" : "border-transparent"
    }`, [scrolled]
  )

  return (
    <motion.header
      className={headerClass}
      variants={animationVariants.header}
      initial="initial"
      animate="animate"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.span
                className="text-xl font-bold whitespace-nowrap bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                whileHover={{
                  backgroundPosition: "200% center",
                }}
                transition={{ duration: 0.5 }}
              >
                EventEase
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <NavItems />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ModeToggle />
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : !user ? (
                <AuthButtons onClose={handleClose} />
              ) : (
                <motion.div
                  key="user-nav"
                  variants={animationVariants.userNav}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <UserNav user={user} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ModeToggle />
            </motion.div>

            <AnimatePresence>
              {!isLoading && user && (
                <motion.div
                  variants={animationVariants.userNav}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <UserNav user={user} />
                </motion.div>
              )}
            </AnimatePresence>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button variant="ghost" size="sm" className="relative overflow-hidden">
                    <motion.div
                      animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <motion.nav
                  className="flex flex-col gap-4 mt-8"
                  variants={animationVariants.mobileNav}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.3, staggerChildren: 0.1 }}
                >
                  <NavItems isMobile={true} />
                  {!isLoading && !user && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <AuthButtons onClose={handleClose} isMobile={true} />
                    </motion.div>
                  )}
                </motion.nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}