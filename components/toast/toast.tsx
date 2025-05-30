"use client"

import { useState, useEffect, createContext, useContext, useRef, type ReactNode } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastQueueRef = useRef<Array<{ message: string; type: ToastType }>>([])

  // Функция для показа уведомления
  const showToast = (message: string, type: ToastType = "info") => {
    // Добавляем уведомление в очередь вместо прямого обновления состояния
    toastQueueRef.current.push({ message, type })
    // Запускаем обработку очереди
    processQueue()
  }

  // Функция для обработки очереди уведомлений
  const processQueue = () => {
    // Используем setTimeout, чтобы выполнить обновление состояния вне цикла рендеринга
    setTimeout(() => {
      if (toastQueueRef.current.length > 0) {
        const nextToast = toastQueueRef.current.shift()
        if (nextToast) {
          const id = Math.random().toString(36).substring(2, 9)
          setToasts((prev) => [...prev, { id, message: nextToast.message, type: nextToast.type }])
        }
      }
    }, 0)
  }

  // Функция для удаления уведомления
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Автоматическое удаление уведомлений через 3 секунды
  useEffect(() => {
    if (toasts.length === 0) return

    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        removeToast(toasts[0].id)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [toasts])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={`p-4 rounded-md shadow-lg flex items-center justify-between min-w-[300px] ${
                toast.type === "success"
                  ? "bg-green-500 text-white"
                  : toast.type === "error"
                    ? "bg-red-500 text-white"
                    : toast.type === "warning"
                      ? "bg-yellow-500 text-white"
                      : "bg-blue-500 text-white"
              }`}
            >
              <p>{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="ml-4">
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const toast = (message: string, type: ToastType = "info") => {
  const toastQueue = (globalThis as any).__TOAST_QUEUE__ || []
  toastQueue.push({ message, type })
  ;(globalThis as any).__TOAST_QUEUE__ = toastQueue
}
