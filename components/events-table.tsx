"use client"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Edit, Eye, MoreHorizontal, Trash, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { deleteEvent, publishEvent } from "@/lib/actions"

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)

  const handleCopyLink = (event: Event) => {
    navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`)
    toast({
      title: "Link copied",
      description: "Event link copied to clipboard",
    })
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteEvent(id)
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the event",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handlePublish = async (id: string, isPublished: boolean) => {
    setIsPublishing(id)
    try {
      await publishEvent(id, !isPublished)
      toast({
        title: isPublished ? "Event unpublished" : "Event published",
        description: isPublished ? "The event is now hidden from the public" : "The event is now visible to the public",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the event",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found. Create your first event to get started.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="font-medium truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/events/${event.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/events/${event.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/events/${event.id}/attendees`}>
                        <Users className="mr-2 h-4 w-4" />
                        Attendees
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {event.published && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event.id}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View Public Page
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(event)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Public Link
                        </DropdownMenuItem>
                      </>
                    )}
                    {!event.published && (
                      <DropdownMenuItem disabled>
                        <Eye className="mr-2 h-4 w-4" />
                        Public Page (Unpublished)
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handlePublish(event.id, event.published)}
                      disabled={isPublishing === event.id}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {event.published ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(event.id)}
                      disabled={isDeleting === event.id}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{event.attendeeCount}</span>
                  </div>
                </div>
                <Badge variant={event.published ? "default" : "outline"}>
                  {event.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No events found. Create your first event to get started.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>
                    <Badge variant={event.published ? "default" : "outline"}>
                      {event.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.attendeeCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/events/${event.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/events/${event.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/events/${event.id}/attendees`}>
                            <Users className="mr-2 h-4 w-4" />
                            Attendees
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {event.published && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.id}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                View Public Page
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyLink(event)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Public Link
                            </DropdownMenuItem>
                          </>
                        )}
                        {!event.published && (
                          <DropdownMenuItem disabled>
                            <Eye className="mr-2 h-4 w-4" />
                            Public Page (Unpublished)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handlePublish(event.id, event.published)}
                          disabled={isPublishing === event.id}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {event.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(event.id)}
                          disabled={isDeleting === event.id}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
