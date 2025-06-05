import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, Eye } from "lucide-react"
import type { EventStats } from "@/lib/types"

interface StatsCardsProps {
  stats: EventStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
          <p className="text-xs text-muted-foreground">{stats.eventsThisMonth} new this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAttendees}</div>
          <p className="text-xs text-muted-foreground">{stats.attendeesThisMonth} new this month</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews}</div>
          <p className="text-xs text-muted-foreground">{stats.viewsThisMonth} new this month</p>
        </CardContent>
      </Card>
    </div>
  )
}
