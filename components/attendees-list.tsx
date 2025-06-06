import { getEventAttendees, getEventById } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExportAttendeesButton } from "@/components/export-attendees-button"

interface AttendeesListProps {
  eventId: string
}

export async function AttendeesList({ eventId }: AttendeesListProps) {
  const attendees = await getEventAttendees(eventId)
  const event = await getEventById(eventId)

  return (
    <Card className="min-h-[400px] flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Attendees ({attendees.length})</CardTitle>
            <CardDescription>People who have RSVP'd to your event</CardDescription>
          </div>
          {attendees.length > 0 && (
            <ExportAttendeesButton eventId={eventId} eventTitle={event?.title} />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {attendees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No attendees yet</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>RSVP Date</TableHead>
                  {event?.customFields?.map((field) => (
                    <TableHead key={field.name}>{field.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{formatDate(attendee.createdAt)}</TableCell>
                    {event?.customFields?.map((field) => (
                      <TableCell key={field.name}>
                        {attendee.customFieldData?.[field.name] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
