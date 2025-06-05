import { DashboardHeader } from "@/components/dashboard-header"
import { EventForm } from "@/components/event-form"
import { getEventById } from "@/lib/data"
import { getServerAuthSession } from "@/lib/get-server-session"
import { notFound, redirect } from "next/navigation"

interface EditEventPageProps {
    params: {
        id: string
    }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const session = await getServerAuthSession()
    const { id } = await params

    if (!session) {
        redirect("/login")
    }

    const event = await getEventById(id)

    if (!event) {
        notFound()
    }

    if (event.userId !== session.user.id && session.user.role !== "ADMIN") {
        redirect("/dashboard/events")
    }

    return (
        <div className="space-y-6">
            <DashboardHeader heading="Edit Event" text={`Update details for "${event.title}"`} />
            <EventForm userId={session.user.id} event={event} />
        </div>
    )
}
