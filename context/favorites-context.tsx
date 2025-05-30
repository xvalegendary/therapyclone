"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useUser } from "@/context/user-context"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image?: string
}

interface FavoritesContextType {
  items: FavoriteItem[]
  addToFavorites: (product: FavoriteItem) => void
  removeFromFavorites: (id: string) => void
  isInFavorites: (id: string) => boolean
  totalItems: number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  // Загрузка избранного с сервера при авторизации
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const response = await fetch("/api/favorites")
          if (response.ok) {
            const data = await response.json()
            if (data.favorites) {
              setItems(data.favorites)
            }
          }
        } catch (error) {
          console.error("Failed to fetch favorites:", error)
        }
      } else {
        setItems([])
      }
    }

    fetchFavorites()
  }, [user])

  const addToFavorites = useCallback(
    (product: FavoriteItem) => {
      if (items.some((item) => item.id === product.id)) {
        return
      }

      setItems((prevItems) => [...prevItems, product])

      // Отправляем запрос на сервер, если пользователь авторизован
      if (user) {
        fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product.id }),
        }).catch((error) => {
          console.error("Error adding to favorites:", error)
        })
      }
    },
    [items, user],
  )

  const removeFromFavorites = useCallback(
    (id: string) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))

      // Отправляем запрос на сервер, если пользователь авторизован
      if (user) {
        fetch("/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: id }),
        }).catch((error) => {
          console.error("Error removing from favorites:", error)
        })
      }
    },
    [user],
  )

  const isInFavorites = useCallback(
    (id: string) => {
      return items.some((item) => item.id === id)
    },
    [items],
  )

  const totalItems = items.length

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        totalItems,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
