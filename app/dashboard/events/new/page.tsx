import { DashboardHeader } from "@/components/dashboard-header"
import { EventForm } from "@/components/event-form"
import { getServerAuthSession } from "@/lib/get-server-session"

export default async function NewEventPage() {
  const session = await getServerAuthSession()

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Create Event" text="Create a new event and publish it to your audience." />
      <EventForm userId={session?.user?.id} />
    </div>
  )
}
