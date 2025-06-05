import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { getEventById } from "@/lib/data"
import { notFound } from "next/navigation"
import { EventDetail } from "@/components/event-detail"
import Link from "next/link"
import { Edit, Share2 } from "lucide-react"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader heading={event.title} text="Event details and management" />
        <div className="flex gap-2">
          {event.published && (
            <Button variant="outline" asChild>
              <Link href={`/events/${event.id}`} target="_blank">
                <Share2 className="mr-2 h-4 w-4" />
                View Public Page
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href={`/dashboard/events/${event.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Link>
          </Button>
        </div>
      </div>
      <EventDetail event={event} />
    </div>
  )
}
