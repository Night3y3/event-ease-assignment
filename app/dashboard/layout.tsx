import type React from "react"
import { Header } from "@/components/header"
import { DashboardNav } from "@/components/dashboard-nav"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/lib/get-server-session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-8">
        <aside className="hidden md:block">
          <DashboardNav user={session.user} />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
