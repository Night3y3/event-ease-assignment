import type React from "react"
import { Header } from "@/components/header"
import { DashboardNav } from "@/components/dashboard-nav"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/lib/get-server-session"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, PlusCircle } from "lucide-react"

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
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 py-4 md:py-6 lg:py-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <DashboardNav user={session.user} />
              </div>
            </aside>

            <div className="min-w-0">
              {/* Mobile Navigation */}
              <div className="lg:hidden mb-4 flex items-center justify-between">
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

                <Button asChild size="sm">
                  <a href="/dashboard/events/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create</span>
                  </a>
                </Button>
              </div>

              <main>{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}