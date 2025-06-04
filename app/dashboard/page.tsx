import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUpcomingEvents, getEventStats } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard-header"
import { EventList } from "@/components/event-list"
import { StatsCards } from "@/components/stats-cards"
import { getServerAuthSession } from "@/lib/get-server-session"

export default async function DashboardPage() {
  const session = await getServerAuthSession()
  const upcomingEvents = await getUpcomingEvents(session?.user?.id)
  const stats = await getEventStats(session?.user?.id)

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Dashboard" text="Manage your events and view analytics." />
      <StatsCards stats={stats} />
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your upcoming events that require attention.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventList events={upcomingEvents} />
        </CardContent>
      </Card>
    </div>
  )
}
