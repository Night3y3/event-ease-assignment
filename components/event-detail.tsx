import type { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { AttendeesList } from "@/components/attendees-list"

interface EventDetailProps {
  event: Event
}

export function EventDetail({ event }: EventDetailProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="details" className="flex-1 sm:flex-none">
            Details
          </TabsTrigger>
          <TabsTrigger value="attendees" className="flex-1 sm:flex-none">
            Attendees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Event Information Card */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Event Information</CardTitle>
                <CardDescription>Basic details about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm break-words">{event.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{event.attendeeCount} attendees</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={event.published ? "default" : "outline"}>
                      {event.published ? "Published" : "Draft"}
                    </Badge>
                    {!event.published && (
                      <span className="text-xs text-muted-foreground">
                        (Not visible to public)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            {event.description && (
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Custom Fields Card */}
            {event.customFields && event.customFields.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Custom Fields</CardTitle>
                  <CardDescription>Additional fields for this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {event.customFields.map((field, index) => (
                      <div
                        key={`${field.name}-${index}`}
                        className="border rounded-lg p-4 bg-card"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-sm truncate pr-2">
                            {field.name}
                          </span>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {field.type}
                          </Badge>
                        </div>
                        {field.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attendees" className="mt-0">
          <div className="w-full">
            <AttendeesList eventId={event.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}