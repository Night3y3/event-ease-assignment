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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              Attendees ({attendees.length})
            </CardTitle>
            <CardDescription>
              People who have RSVP'd to your event
            </CardDescription>
          </div>
          {attendees.length > 0 && (
            <div className="flex-shrink-0">
              <ExportAttendeesButton
                eventId={eventId}
                eventTitle={event?.title}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0 sm:px-6">
        {attendees.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="mx-auto max-w-sm">
              <div className="rounded-full bg-muted/50 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                No attendees yet
              </h3>
              <p className="text-xs text-muted-foreground">
                Attendees will appear here once they RSVP to your event
              </p>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      RSVP Date
                    </TableHead>
                    {event?.customFields?.map((field) => (
                      <TableHead
                        key={field.name}
                        className="font-semibold whitespace-nowrap"
                      >
                        {field.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate" title={attendee.name}>
                          {attendee.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="truncate" title={attendee.email}>
                          {attendee.email}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(attendee.createdAt)}
                      </TableCell>
                      {event?.customFields?.map((field) => (
                        <TableCell key={field.name} className="max-w-[150px]">
                          <div
                            className="truncate text-sm"
                            title={attendee.customFieldData?.[field.name] || "-"}
                          >
                            {attendee.customFieldData?.[field.name] || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}