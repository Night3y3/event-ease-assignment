import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { getAllEvents } from "@/lib/data"
import { EventsTable } from "@/components/events-table"
import { getServerAuthSession } from "@/lib/get-server-session"

export default async function EventsPage() {
  const session = await getServerAuthSession()
  const events = await getAllEvents(session?.user?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader heading="Events" text="Create and manage your events." />
        <Button asChild>
          <Link href="/dashboard/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>
      <EventsTable events={events} />
    </div>
  )
}
