"use client"

import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: {
    name: string
    email: string
    avatar?: string | null
  }
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-xl",
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (user.avatar) {
    return (
      <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn("flex items-center justify-center rounded-full bg-muted font-medium", sizeClasses[size], className)}
    >
      {user.name ? getInitials(user.name) : <User className="h-4 w-4" />}
    </div>
  )
}
