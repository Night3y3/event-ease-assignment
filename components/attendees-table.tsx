"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AttendeeWithEvent } from "@/lib/types"

interface AttendeesTableProps {
    attendees: AttendeeWithEvent[]
    isAdmin?: boolean
}

export function AttendeesTable({ attendees, isAdmin = false }: AttendeesTableProps) {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [eventFilter, setEventFilter] = useState<string>("all")
    const [isExporting, setIsExporting] = useState(false)

    // Get unique events for filter
    const uniqueEvents = Array.from(new Set(attendees.map((a) => a.event.id)))
        .map((id) => attendees.find((a) => a.event.id === id)?.event)
        .filter(Boolean)

    // Filter attendees based on search and event filter
    const filteredAttendees = attendees.filter((attendee) => {
        const matchesSearch =
            attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendee.event.title.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesEvent = eventFilter === "all" || attendee.event.id === eventFilter

        return matchesSearch && matchesEvent
    })

    const handleExportAll = async () => {
        setIsExporting(true)
        try {
            const response = await fetch("/api/attendees/export", {
                method: "GET",
            })

            if (!response.ok) {
                throw new Error("Failed to export attendees")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = `all-attendees-${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast({
                title: "Export successful",
                description: "All attendees data has been exported to CSV",
            })
        } catch (error) {
            toast({
                title: "Export failed",
                description: "Failed to export attendees data",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search attendees, emails, or events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        {uniqueEvents.map((event) => (
                            <SelectItem key={event!.id} value={event!.id}>
                                {event!.title}
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
                Showing {filteredAttendees.length} of {attendees.length} attendees
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Event Date</TableHead>
                            <TableHead>RSVP Date</TableHead>
                            <TableHead>Status</TableHead>
                            {isAdmin && <TableHead>Organizer</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAttendees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                                    No attendees found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAttendees.map((attendee) => (
                                <TableRow key={attendee.id}>
                                    <TableCell className="font-medium">{attendee.name}</TableCell>
                                    <TableCell>{attendee.email}</TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] truncate" title={attendee.event.title}>
                                            {attendee.event.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(attendee.event.date)}</TableCell>
                                    <TableCell>{formatDate(attendee.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={new Date(attendee.event.date) > new Date() ? "default" : "secondary"}>
                                            {new Date(attendee.event.date) > new Date() ? "Upcoming" : "Past"}
                                        </Badge>
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{attendee.event.user.name}</div>
                                                <div className="text-muted-foreground">{attendee.event.user.email}</div>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
