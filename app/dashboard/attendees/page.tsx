import { DashboardHeader } from "@/components/dashboard-header"
import { getServerAuthSession } from "@/lib/get-server-session"
import { getAllAttendees, getAllEvents } from "@/lib/data"
import { AttendeesTable } from "@/components/attendees-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp } from "lucide-react"

export default async function AttendeesPage() {
    const session = await getServerAuthSession()

    // Get attendees based on user role
    const attendees = await getAllAttendees(session?.user?.role === "ADMIN" ? undefined : session?.user?.id)
    const events = await getAllEvents(session?.user?.role === "ADMIN" ? undefined : session?.user?.id)

    // Calculate stats
    const totalAttendees = attendees.length
    const uniqueAttendees = new Set(attendees.map((a) => a.email)).size
    const totalEvents = events.length

    return (
        <div className="space-y-6">
            <DashboardHeader
                heading="Attendees"
                text={
                    session?.user?.role === "ADMIN"
                        ? "Manage all attendees across the platform"
                        : "View and manage your event attendees"
                }
            />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAttendees}</div>
                        <p className="text-xs text-muted-foreground">Across all events</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Attendees</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniqueAttendees}</div>
                        <p className="text-xs text-muted-foreground">Individual people</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">Events with RSVPs</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendees Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Attendees</CardTitle>
                    <CardDescription>
                        {session?.user?.role === "ADMIN"
                            ? "Complete list of all attendees across the platform"
                            : "All attendees who have RSVP'd to your events"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AttendeesTable attendees={attendees} isAdmin={session?.user?.role === "ADMIN"} />
                </CardContent>
            </Card>
        </div>
    )
}
