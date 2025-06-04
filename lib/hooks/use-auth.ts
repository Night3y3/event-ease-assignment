"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user: User | null = session?.user
    ? {
        id: session.user.id!,
        name: session.user.name!,
        email: session.user.email!,
        role: (session.user.role as "ADMIN" | "STAFF" | "EVENT_OWNER") || "EVENT_OWNER",
        createdAt: new Date(),
      }
    : null

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    // Auto-login after registration
    await login(email, password)
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return {
    user,
    isLoading: status === "loading",
    login,
    register,
    logout,
  }
}
