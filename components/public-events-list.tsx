import type { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface PublicEventsListProps {
  events: Event[]
}

export function PublicEventsList({ events }: PublicEventsListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events available at the moment</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </CardDescription>
              </div>
              <Badge variant="secondary">{event.attendeeCount} attending</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.description && <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>}
            <Button asChild className="w-full">
              <Link href={`/events/${event.id}`}>View Event & RSVP</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
