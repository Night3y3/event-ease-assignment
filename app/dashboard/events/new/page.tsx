import { DashboardHeader } from "@/components/dashboard-header"
import { EventForm } from "@/components/event-form"
import { getServerAuthSession } from "@/lib/get-server-session"

export default async function NewEventPage() {
  const session = await getServerAuthSession()

  return (
    <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 space-y-6">
      <DashboardHeader
        heading="Create Event"
        text="Create a new event and publish it to your audience."
      />
      <EventForm userId={session?.user?.id} />
    </div>
  )
}