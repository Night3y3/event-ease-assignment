"use client"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Copy, Eye, Edit, Trash, MoreHorizontal, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteEvent, publishEvent } from "@/lib/actions"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminEventsTableProps {
    events: Event[]
}

export function AdminEventsTable({ events }: AdminEventsTableProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [organizerFilter, setOrganizerFilter] = useState<string>("all")
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isPublishing, setIsPublishing] = useState<string | null>(null)

    // Get unique organizers for filter
    const uniqueOrganizers = Array.from(new Set(events.map((e) => e.user?.email)))
        .filter(Boolean)
        .sort()

    // Filter events based on search and filters
    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "published" && event.published) ||
            (statusFilter === "draft" && !event.published)

        const matchesOrganizer = organizerFilter === "all" || event.user?.email === organizerFilter

        return matchesSearch && matchesStatus && matchesOrganizer
    })

    const handleExportAll = async () => {
        setIsExporting(true)
        try {
            const response = await fetch("/api/admin/events/export", {
                method: "GET",
            })

            if (!response.ok) {
                throw new Error("Failed to export events")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = `all-events-${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast({
                title: "Export successful",
                description: "All events data has been exported to CSV",
            })
        } catch (error) {
            toast({
                title: "Export failed",
                description: "Failed to export events data",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    const handleCopyRSVPLink = (event: Event) => {
        const rsvpLink = `${window.location.origin}/events/${event.id}`
        navigator.clipboard.writeText(rsvpLink)
        toast({
            title: "RSVP link copied",
            description: "Event RSVP link copied to clipboard",
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
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events, organizers, or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={organizerFilter} onValueChange={setOrganizerFilter}>
                    <SelectTrigger className="w-full lg:w-[200px]">
                        <SelectValue placeholder="Organizer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Organizers</SelectItem>
                        {uniqueOrganizers.map((email) => (
                            <SelectItem key={email} value={email!}>
                                {email}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleExportAll} disabled={isExporting} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export All"}
                </Button>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Showing {filteredEvents.length} of {events.length} events
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[200px]">Event Title</TableHead>
                            <TableHead className="min-w-[150px]">Organizer</TableHead>
                            <TableHead>Event Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead className="min-w-[150px]">Location</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEvents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            <div className="font-medium">{event.title}</div>
                                            {event.description && (
                                                <div className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
                                                    {event.description}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">{event.user?.name || "N/A"}</div>
                                            <div className="text-muted-foreground">{event.user?.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(event.date)}</TableCell>
                                    <TableCell>
                                        <Badge variant={event.published ? "default" : "outline"}>
                                            {event.published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{event.attendeeCount}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[150px] truncate" title={event.location || "N/A"}>
                                            {event.location || "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(event.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/events/${event.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/events/${event.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Event
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/events/${event.id}/attendees`}>
                                                        <Users className="mr-2 h-4 w-4" />
                                                        View Attendees
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleCopyRSVPLink(event)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy RSVP Link
                                                </DropdownMenuItem>
                                                {event.published && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/events/${event.id}`} target="_blank">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Public Page
                                                        </Link>
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
                                                    Delete Event
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
