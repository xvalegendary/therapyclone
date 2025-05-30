"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context"
import { useLanguage } from "@/context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Package, Heart, Settings, LogOut, Copy, Check } from "lucide-react"
import { useToast } from "@/components/toast/toast"
import { ChangePasswordForm } from "./change-password-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createTranslator } from "@/lib/translation-helper"

interface UserDashboardProps {
  token: string
  onLogout: () => void
}

interface UserData {
  id: string
  name: string
  email: string
  referralCode: string
  createdAt: string
}

export function UserDashboard({ token, onLogout }: UserDashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [copied, setCopied] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const { theme } = useTheme()
  const { language } = useLanguage()
  const t = createTranslator(language)
  const { showToast } = useToast()

  useEffect(() => {
    // Получаем данные пользователя
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()

          // Если токен истек, выходим из аккаунта
          if (errorData.error === "Token expired") {
            showToast("Your session has expired. Please log in again.", "info")
            onLogout()
            return
          }

          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUserData(data.user)
      } catch (error) {
        console.error("Error fetching user data:", error)
        showToast("Error loading user data", "error")
        onLogout()
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [token, onLogout, showToast])

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      })
      showToast("Logged out successfully", "success")
      onLogout()
    } catch (error) {
      console.error("Logout error:", error)
      // Даже если API вызов не удался, все равно выходим
      onLogout()
    }
  }

  const copyReferralCode = () => {
    if (userData) {
      navigator.clipboard.writeText(userData.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Загружаем данные о заказах пользователя
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const fetchOrders = async () => {
    if (activeTab === "orders" && orders.length === 0 && !ordersLoading) {
      setOrdersLoading(true)
      try {
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setOrdersLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  // Загружаем избранные товары пользователя
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)

  const fetchFavorites = async () => {
    if (activeTab === "favorites" && favorites.length === 0 && !favoritesLoading) {
      setFavoritesLoading(true)
      try {
        const response = await fetch("/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setFavorites(data.favorites)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setFavoritesLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [activeTab])

  if (isLoading) {
    return (
      <div
        className={`min-h-screen pt-20 pb-10 flex items-center justify-center ${theme === "dark" ? "bg-dark-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <Loader2
            className={`h-10 w-10 animate-spin mx-auto mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          />
          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{t("account.loading", "Loading...")}</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className={`min-h-screen pt-20 pb-10 ${theme === "dark" ? "bg-dark-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {t("account.errorLoading", "Error loading account information")}
          </p>
          <Button onClick={onLogout} className="mt-4">
            {t("account.backToLogin", "Back to Login")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pt-20 pb-10 ${theme === "dark" ? "bg-dark-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {t("account.dashboard", "Dashboard")}
            </h1>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              {t("account.logout", "Logout")}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("account.profile", "Profile")}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t("account.orders", "Orders")}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {t("account.favorites", "Favorites")}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t("account.settings", "Settings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t("account.profileInfo", "Profile Information")}</CardTitle>
                  <CardDescription>
                    {t("account.profileDescription", "View and update your personal information")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {t("account.name", "Name")}
                      </h3>
                      <p className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{userData.name}</p>
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {t("account.email", "Email")}
                      </h3>
                      <p className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{userData.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {t("account.memberSince", "Member Since")}
                    </h3>
                    <p className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className={`pt-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {t("account.referralCode", "Referral Code")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <code
                        className={`px-3 py-1 rounded ${theme === "dark" ? "bg-dark-700 text-white" : "bg-gray-100 text-gray-900"}`}
                      >
                        {userData.referralCode}
                      </code>
                      <Button size="sm" variant="outline" onClick={copyReferralCode}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {t("account.referralDescription", "Share this code with friends to earn rewards")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>{t("account.orderHistory", "Order History")}</CardTitle>
                  <CardDescription>
                    {t("account.orderHistoryDescription", "View your past orders and their status")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div
                          key={order.id}
                          className={`p-4 rounded-lg ${theme === "dark" ? "bg-dark-700" : "bg-gray-100"}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              Order #{order.id.substring(0, 8)}
                            </h3>
                            <Badge
                              variant="outline"
                              className={
                                order.status === "completed"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : order.status === "processing"
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            Total: ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{t("account.noOrders", "You haven't placed any orders yet")}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("account.shopNow", "Shop Now")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>{t("account.savedItems", "Saved Items")}</CardTitle>
                  <CardDescription>
                    {t("account.savedItemsDescription", "Products you've added to your favorites")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favoritesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((favorite: any) => (
                        <div
                          key={favorite.id}
                          className={`p-4 rounded-lg flex items-center gap-4 ${
                            theme === "dark" ? "bg-dark-700" : "bg-gray-100"
                          }`}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-md">
                            <img
                              src={favorite.image || "/placeholder.svg"}
                              alt={favorite.name}
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {favorite.name}
                            </h3>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                              ${favorite.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{t("account.noFavorites", "You haven't added any favorites yet")}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("account.browseProducts", "Browse Products")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>{t("account.accountSettings", "Account Settings")}</CardTitle>
                  <CardDescription>
                    {t("account.accountSettingsDescription", "Manage your account preferences")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {t("account.accountStatus", "Account Status")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {t("account.active", "Active")}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {t("account.passwordUpdate", "Password Update")}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => setIsChangePasswordOpen(true)}>
                      {t("account.changePassword", "Change Password")}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {t("account.notifications", "Notifications")}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span>{t("account.emailNotifications", "Email Notifications")}</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t("account.marketingEmails", "Marketing Emails")}</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">{t("account.saveChanges", "Save Changes")}</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Диалог смены пароля */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className={theme === "dark" ? "bg-dark-800 text-white" : "bg-white text-gray-900"}>
          <DialogHeader>
            <DialogTitle>{t("changePassword", "Change Password")}</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm
            token={token}
            onSuccess={() => setIsChangePasswordOpen(false)}
            onCancel={() => setIsChangePasswordOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
