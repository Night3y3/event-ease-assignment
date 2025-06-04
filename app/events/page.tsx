import { Header } from "@/components/header"
import { getAllPublicEvents } from "@/lib/data"
import { PublicEventsList } from "@/components/public-events-list"

export default async function PublicEventsPage() {
  const events = await getAllPublicEvents()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Upcoming Events</h1>
            <p className="text-muted-foreground">Discover and RSVP to exciting events happening near you</p>
          </div>
          <PublicEventsList events={events} />
        </div>
      </main>
    </div>
  )
}
