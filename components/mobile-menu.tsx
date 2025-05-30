"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-3/4 max-w-sm border-l bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link href="/" onClick={onClose} className="text-lg font-medium">
            Home
          </Link>
          <Link href="/shop" onClick={onClose} className="text-lg font-medium">
            Shop
          </Link>
          <Link href="/about" onClick={onClose} className="text-lg font-medium">
            About
          </Link>
          <Link href="/account" onClick={onClose} className="text-lg font-medium">
            Account
          </Link>
        </nav>
      </div>
    </div>
  )
}
