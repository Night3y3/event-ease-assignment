import type { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"
import { RSVPForm } from "@/components/rsvp-form"

interface PublicEventDetailProps {
  event: Event
}

export function PublicEventDetail({ event }: PublicEventDetailProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{event.title}</h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">{formatDate(event.date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">{event.attendeeCount} attending</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 px-4">
        <div className="space-y-6">
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground break-words">{event.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Attendees</p>
                  <p className="text-sm text-muted-foreground">{event.attendeeCount} people attending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <RSVPForm event={event} />
        </div>
      </div>
    </div>
  )
}
