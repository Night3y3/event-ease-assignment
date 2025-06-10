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
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <DashboardHeader
                heading={event.title}
                text="Event details and management"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-shrink-0">
              {event.published && (
                <Button
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href={`/events/${event.id}`} target="_blank">
                    <Share2 className="mr-2 h-4 w-4" />
                    View Public Page
                  </Link>
                </Button>
              )}
              <Button
                asChild
                className="w-full sm:w-auto"
              >
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Event Detail Component */}
          <div className="w-full">
            <EventDetail event={event} />
          </div>
        </div>
      </div>
    </div>
  )
}