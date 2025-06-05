import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
                Simplify Your Event Management
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl mx-auto lg:mx-0">
                EventEase helps you create, manage, and track events with ease. From RSVPs to attendee management, we've
                got you covered.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center order-first lg:order-last">
            <div className="relative h-[250px] sm:h-[300px] lg:h-[350px] w-full overflow-hidden rounded-xl bg-muted">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm">
                  <div className="h-20 sm:h-24 lg:h-32 rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg">
                    <div className="h-3 sm:h-4 w-3/4 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-1/2 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-20 sm:h-24 lg:h-32 rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg">
                    <div className="h-3 sm:h-4 w-3/4 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-1/2 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-20 sm:h-24 lg:h-32 rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg">
                    <div className="h-3 sm:h-4 w-3/4 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-1/2 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-20 sm:h-24 lg:h-32 rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg">
                    <div className="h-3 sm:h-4 w-3/4 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-1/2 rounded bg-muted-foreground/20 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
