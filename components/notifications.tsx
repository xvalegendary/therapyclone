"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, ShoppingBag, Package } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/context/theme-context"

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: "order" | "system" | "promo"
}

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Welcome to SDFM 2520",
      message: "Thank you for joining our community! Explore our premium hoodie collection.",
      time: "Just now",
      read: false,
      type: "system",
    },
    {
      id: 2,
      title: "New Collection",
      message: "Check out our latest summer collection!",
      time: "2 hours ago",
      read: false,
      type: "promo",
    },
    {
      id: 3,
      title: "Sale Alert",
      message: "50% off on all hoodies this weekend!",
      time: "Yesterday",
      read: false,
      type: "promo",
    },
  ])
  const { theme } = useTheme()
  const processedNotificationsRef = useRef<Set<number>>(new Set())

  // Слушаем новые уведомления
  useEffect(() => {
    const handleStorageChange = (event) => {
      try {
        // Проверяем, что изменился именно ключ newNotification
        if (event.key === "newNotification") {
          const newNotificationJson = localStorage.getItem("newNotification")
          if (newNotificationJson) {
            const newNotification = JSON.parse(newNotificationJson) as Notification

            // Проверяем, не обрабатывали ли мы уже это уведомление
            if (!processedNotificationsRef.current.has(newNotification.id)) {
              processedNotificationsRef.current.add(newNotification.id)
              setNotifications((prev) => [newNotification, ...prev])
              localStorage.removeItem("newNotification")
            }
          }
        }
      } catch (e) {
        console.error("Error handling notification", e)
      }
    }

    // Устанавливаем обработчик события
    window.addEventListener("storage", handleStorageChange)

    // Очистка
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Отдельный эффект для проверки при монтировании
  useEffect(() => {
    try {
      const newNotificationJson = localStorage.getItem("newNotification")
      if (newNotificationJson) {
        const newNotification = JSON.parse(newNotificationJson) as Notification

        // Проверяем, не обрабатывали ли мы уже это уведомление
        if (!processedNotificationsRef.current.has(newNotification.id)) {
          processedNotificationsRef.current.add(newNotification.id)
          setNotifications((prev) => [newNotification, ...prev])
          localStorage.removeItem("newNotification")
        }
      }
    } catch (e) {
      console.error("Error handling notification on mount", e)
    }
  }, [])

  // Очистка обработанных уведомлений через некоторое время
  useEffect(() => {
    const interval = setInterval(() => {
      processedNotificationsRef.current.clear()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />
      case "promo":
        return <ShoppingBag className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <>
      <motion.button
        className={`fixed right-6 top-44 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
          theme === "dark" ? "bg-dark-800 hover:bg-dark-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`fixed right-0 top-0 h-full w-full max-w-md shadow-xl z-50 ${
                theme === "dark" ? "bg-dark-800" : "bg-white"
              }`}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div
                  className={`flex items-center justify-between border-b px-6 py-4 ${
                    theme === "dark" ? "border-dark-600" : "border-gray-200"
                  }`}
                >
                  <h2
                    className={`text-xl font-semibold flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Bell className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-blue-500" : "text-blue-600"}`} />
                    Notifications
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      className={`text-sm ${
                        theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                      }`}
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                    <button
                      className={theme === "dark" ? "text-white" : "text-gray-900"}
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Notifications list */}
                <div className="flex-1 overflow-auto py-4">
                  {notifications.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <Bell className={`h-16 w-16 mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-300"}`} />
                      <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No notifications</p>
                    </div>
                  ) : (
                    <ul className={`divide-y px-6 ${theme === "dark" ? "divide-dark-600" : "divide-gray-200"}`}>
                      {notifications.map((notification) => (
                        <motion.li
                          key={notification.id}
                          className={`py-4 ${notification.read ? "opacity-60" : ""}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                notification.read ? (theme === "dark" ? "bg-gray-500" : "bg-gray-300") : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center">
                                {getNotificationIcon(notification.type)}
                                <h3 className={`font-medium ml-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  {notification.title}
                                </h3>
                              </div>
                              <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
