import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Simplify Your Event Management
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                EventEase helps you create, manage, and track events with ease. From RSVPs to attendee management, we've
                got you covered.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-muted">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="h-32 rounded-lg bg-background/80 p-4 shadow-lg">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-1/2 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-32 rounded-lg bg-background/80 p-4 shadow-lg">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-1/2 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-32 rounded-lg bg-background/80 p-4 shadow-lg">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-1/2 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-32 rounded-lg bg-background/80 p-4 shadow-lg">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-1/2 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-5/6 rounded bg-muted-foreground/20" />
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
