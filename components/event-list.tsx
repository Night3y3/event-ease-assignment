import { formatDate } from "@/lib/utils"
import type { Event } from "@/lib/types"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No events found</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/dashboard/events/${event.id}`}
          className="block hover:bg-muted/50 p-4 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h3 className="font-medium text-base sm:text-lg">{event.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 mb-1 sm:mb-0">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1 mb-1 sm:mb-0">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{event.attendeeCount} attendees</span>
                </div>
              </div>
            </div>
            <Badge
              variant={event.published ? "default" : "outline"}
              className="self-start sm:self-auto"
            >
              {event.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}
