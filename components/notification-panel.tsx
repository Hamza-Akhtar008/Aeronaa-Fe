"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X, Eye } from "lucide-react"  // 👁️ Added Eye icon
import { GetNotification, ReadNotification } from "@/lib/api"
import { useAuth } from "@/store/authContext"

interface user {
  id: string
}
interface APINotification {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  text: string
  link: string
  seen: boolean
  notificationFor: user | null
}

interface NotificationPanelProps {
  onNotificationClear?: (id: number) => void
}

export function NotificationPanel({ onNotificationClear }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const { auth } = useAuth()
  const [notifications, setNotifications] = useState<APINotification[]>([])

  const fetchNotifications = async () => {
    const response = await GetNotification()
    setNotifications(response)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const onNotificationRead = async (id: string) => {
    await ReadNotification(id)
    fetchNotifications()
  }

  // ✅ Only count unseen notifications for the logged-in user
  useEffect(() => {
    const filtered = notifications.filter(
      (n) => n.notificationFor?.id == auth?.id && !n.seen
    )
    setUnreadCount(filtered.length)
  }, [notifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

 return (
  <div className="abosolue" ref={panelRef}>
    {/* 🔔 Notification Toggle Button */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
    >
      <Bell className="w-5 h-5 text-gray-700" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>

    {/* 🔽 Dropdown Panel */}
    {isOpen && (
      <div
        className="
          absolute right-0 mt-3
          bg-white shadow-xl border border-gray-200
          rounded-xl z-50
          w-80 sm:w-96
          max-h-[70vh]
          overflow-y-auto
          animate-in fade-in slide-in-from-top-2
        "
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="text-red-500 text-xs font-semibold">
                ({unreadCount})
              </span>
            )}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No notifications found
            </div>
          ) : (
            notifications
              .filter((n) => n.notificationFor?.id == auth?.id)
              .map((n) => (
                <button
                  key={n.id}
                  className={`
                    w-full text-left px-4 py-3 flex items-start gap-3
                    hover:bg-gray-50 transition
                    ${!n.seen ? "bg-blue-50" : ""}
                  `}
                  onClick={() => onNotificationRead(String(n.id))}
                >
                  {/* Dot indicator */}
                  <div className="mt-1">
                    {!n.seen && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full block"></span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      Booking Update
                    </p>
                    <p className="text-xs text-gray-600 mt-1 break-words">
                      {n.text}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>

                  {/* Read button */}
                  {!n.seen && (
                    <Eye className="w-4 h-4 text-blue-600 mt-1" />
                  )}
                </button>
              ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-3">
            <button className="w-full text-sm font-medium text-[#0a3a7a] py-2 rounded hover:bg-gray-50 transition">
              View All Notifications
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)

}
