"use client"

import { useState, useEffect } from "react"

export type SessionStatus = "loading" | "authenticated" | "unauthenticated"

interface User {
  id: string
  name: string
  email: string
}

interface Session {
  user: User | null
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<SessionStatus>("loading")

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session")

        if (response.ok) {
          const data = await response.json()

          if (data.user) {
            setSession({ user: data.user })
            setStatus("authenticated")
          } else {
            setSession(null)
            setStatus("unauthenticated")
          }
        } else {
          setSession(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Error fetching session:", error)
        setSession(null)
        setStatus("unauthenticated")
      }
    }

    fetchSession()
  }, [])

  return {
    session,
    status,
  }
}
