import { Header } from "@/components/header"
import { getEventById, trackEventView } from "@/lib/data"
import { notFound } from "next/navigation"
import { PublicEventDetail } from "@/components/public-event-detail"
import { headers } from "next/headers"

interface PublicEventPageProps {
  params: {
    id: string
  }
}

export default async function PublicEventPage({ params }: PublicEventPageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event || !event.published) {
    notFound()
  }

  // Track page view
  const headersList = await headers()
  const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip")
  const userAgent = headersList.get("user-agent")

  await trackEventView(id, ipAddress || undefined, userAgent || undefined)

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 container py-6 sm:py-8 mx-auto w-full">
        <PublicEventDetail event={event} />
      </main>
    </div>
  )
}
