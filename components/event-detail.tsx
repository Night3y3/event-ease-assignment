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
    <Tabs defaultValue="details">
      <TabsList className="mb-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="attendees">Attendees</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Basic details about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(event.date)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.attendeeCount} attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Badge variant={event.published ? "default" : "outline"}>
                  {event.published ? "Published" : "Draft"}
                </Badge>
                {!event.published && (
                  <span className="text-sm text-muted-foreground ml-2">(Not visible to public)</span>
                )}
              </div>
            </CardContent>
          </Card>

          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          )}

          {event.customFields && event.customFields.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
                <CardDescription>Additional fields for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {event.customFields.map((field, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{field.name}</span>
                        <Badge variant="outline" className="text-xs">
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
      <TabsContent value="attendees">
        <AttendeesList eventId={event.id} />
      </TabsContent>
    </Tabs>
  )
}
