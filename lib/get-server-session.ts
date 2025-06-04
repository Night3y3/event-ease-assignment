import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { User } from "@/lib/types"

export async function getServerAuthSession() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  const user: User = {
    id: session.user.id!,
    name: session.user.name!,
    email: session.user.email!,
    role: (session.user.role as "ADMIN" | "STAFF" | "EVENT_OWNER") || "EVENT_OWNER",
    createdAt: new Date(),
  }

  return { user }
}
