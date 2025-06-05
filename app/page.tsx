"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/hooks/use-auth"

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        {!user && (<section className="py-8 md:py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
                  Ready to simplify your event management?
                </h2>
                <p className="max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl">
                  Join EventEase today and start creating memorable events with ease.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>)}
      </main>
    </div>
  )
}
