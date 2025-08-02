"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { apiService, DriverRatingData } from "@/lib/api"
import { Star, Users, Car, Coins, Calendar, Phone, User, Eye, RefreshCw } from "lucide-react"

export default function DriverRatings() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<DriverRatingData[]>([])
  const [selectedDriver, setSelectedDriver] = useState<DriverRatingData | null>(null)

  useEffect(() => {
    fetchDriverRatings()
  }, [])

  const fetchDriverRatings = async () => {
    try {
      setLoading(true)
      const data = await apiService.getDriverRatings()
      setDrivers(data)
    } catch (error: any) {
      console.error('Driver ratings fetch error:', error)
      
      // Xatolik turiga qarab xabar berish
      let errorMessage = "Haydovchilar reytingi yuklanmadi"
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication kerak. Iltimos, qaytadan tizimga kiring"
      } else if (error?.response?.status === 403) {
        errorMessage = "Bu sahifaga kirish huquqi yo'q"
      } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        errorMessage = "Server bilan bog'lanishda muammo. Iltimos, keyinroq urinib ko'ring"
      } else if (!error?.response) {
        errorMessage = "Tarmoq xatoligi. Internet aloqasini tekshiring"
      }
      
      toast({
        title: "❌ Xatolik",
        description: errorMessage,
        variant: "destructive"
      })
      
      // Bo'sh array qo'yish xatolik bo'lganda
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
          }`}
        />
      )
    }
    return stars
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">✅ {t("active")}</Badge>
      case 'pending':
        return <Badge variant="secondary">⏳ {t("pending")}</Badge>
      case 'blocked':
        return <Badge variant="destructive">🚫 {t("blocked")}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            📊 Haydovchilar reytingi
          </CardTitle>
          <CardDescription>
            🚗 Haydovchilar reytingi yuklanmoqda...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          📊 {t("driverRatingsTitle")}
        </CardTitle>
        <CardDescription>
          🚗 {t("driverRatingsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drivers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-lg font-medium">Haydovchilar reytingi mavjud emas</p>
                <p className="text-sm">Hali hech qanday haydovchi baholanmagan</p>
              </div>
              <Button 
                onClick={fetchDriverRatings} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Qayta yuklash
              </Button>
            </div>
          ) : (
            drivers.map((driver) => (
              <div key={driver.driver_id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{driver.driver_name}</h3>
                      <p className="text-sm text-muted-foreground">@{driver.driver_username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {getRatingStars(driver.avg_rating)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {driver.avg_rating} ({driver.total_ratings} ta reyting)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{driver.driver_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <span>{driver.total_orders} buyurtma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>{driver.balls} ball</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>{formatDate(driver.date_joined)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(driver.status)}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedDriver(driver)}
                        className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        👁️ {t("viewRatings")}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>📊 {driver.driver_name} {t("driverRatings")}</DialogTitle>
                        <DialogDescription>
                          💬 {t("driverRatingsDescription")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Driver Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>👤 {t("name")}:</strong> {driver.driver_name}
                            </div>
                            <div>
                              <strong>📞 {t("phone")}:</strong> {driver.driver_phone}
                            </div>
                            <div>
                              <strong>🔗 {t("username")}:</strong> @{driver.driver_username}
                            </div>
                            <div>
                              <strong>🎯 {t("balls")}:</strong> {driver.balls}
                            </div>
                            <div>
                              <strong>📦 {t("orders")}:</strong> {driver.total_orders}
                            </div>
                            <div>
                              <strong>⭐ {t("averageRating")}:</strong> {driver.avg_rating}/5
                            </div>
                          </div>
                        </div>

                        {/* Recent Ratings */}
                        <div>
                          <h4 className="font-medium mb-3">📈 {t("recentRatings")}</h4>
                          {driver.recent_ratings.length === 0 ? (
                            <p className="text-muted-foreground">📭 {t("noRatingsYet")}</p>
                          ) : (
                            <div className="space-y-3">
                              {driver.recent_ratings.map((rating) => (
                                <div key={rating.id} className="border rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        {getRatingStars(rating.score)}
                                      </div>
                                      <span className="font-medium">{rating.client_name}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(rating.created_at)}
                                    </span>
                                  </div>
                                  {rating.comment && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      "{rating.comment}"
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>📊 {t("totalDrivers").replace("{}", drivers.length.toString())}</span>
            <button
              onClick={fetchDriverRatings}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              🔄 {t("refresh")}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 