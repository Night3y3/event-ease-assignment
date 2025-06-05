import { CalendarDays, Users, Share2, BarChart3 } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
              Everything you need to manage your events
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl">
              EventEase provides a comprehensive set of tools to create, manage, and track your events with ease.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 gap-6 py-8 md:py-12 lg:gap-12">
          <div className="flex flex-col items-start space-y-4 text-center sm:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted mx-auto sm:mx-0">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold">Event Management</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Create and manage events with customizable fields, dates, locations, and descriptions.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4 text-center sm:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted mx-auto sm:mx-0">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold">Attendee Management</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Track RSVPs, manage attendees, and export data for your events.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4 text-center sm:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted mx-auto sm:mx-0">
              <Share2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold">Public Event Sharing</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Generate shareable links for your events and collect RSVPs from attendees.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4 text-center sm:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted mx-auto sm:mx-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold">Role-Based Access</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Secure access control with Admin, Staff, and Event Owner roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
