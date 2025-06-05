import type React from "react"
import { Header } from "@/components/header"
import { DashboardNav } from "@/components/dashboard-nav"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/lib/get-server-session"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

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
      <div className="flex-1 container grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 p-4 md:p-6 lg:p-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <DashboardNav user={session.user} />
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px]">
              <div className="mt-4">
                <DashboardNav user={session.user} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
