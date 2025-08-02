"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiService, StatisticsData } from "@/lib/api"
import { BarChart3, Users, Car, Package, Truck, CreditCard, FileText, Plane, Train, Star, TrendingUp, RefreshCw } from "lucide-react"

export default function DetailedStatistics() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState<StatisticsData | null>(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const data = await apiService.getStatistics()
      setStatistics(data)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Statistika yuklanmadi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Statistika mavjud emas
      </div>
    )
  }

  // Safe access to nested properties
  const users = statistics.users || {}
  const orders = statistics.orders || {}
  const payments = statistics.payments || {}
  const applications = statistics.applications || {}
  const tickets = statistics.tickets || {}
  const ratings = statistics.ratings || {}
  const recentActivity = statistics.recent_activity || {}

  return (
    <div className="space-y-6">
      {/* Users Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Foydalanuvchilar
          </CardTitle>
          <CardDescription>
            Tizimdagi foydalanuvchilar statistikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{users.total || 0}</div>
              <div className="text-sm text-muted-foreground">Jami foydalanuvchilar</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{users.drivers || 0}</div>
              <div className="text-sm text-muted-foreground">Haydovchilar</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{users.clients || 0}</div>
              <div className="text-sm text-muted-foreground">Mijozlar</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{users.new_month || 0}</div>
              <div className="text-sm text-muted-foreground">Yangi (30 kun)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Buyurtmalar
          </CardTitle>
          <CardDescription>
            Buyurtmalar statistikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-medium">Umumiy ma'lumot</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">{orders.total || 0}</div>
                  <div className="text-sm text-muted-foreground">Jami buyurtma</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">{orders.today || 0}</div>
                  <div className="text-sm text-muted-foreground">Bugun</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">{orders.week || 0}</div>
                  <div className="text-sm text-muted-foreground">Haftada</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">{orders.month || 0}</div>
                  <div className="text-sm text-muted-foreground">Oyda</div>
                </div>
              </div>
            </div>

            {/* Order Categories */}
            <div className="space-y-4">
              <h3 className="font-medium">Kategoriyalar bo'yicha</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <span>Taxi</span>
                  </div>
                  <Badge variant="secondary">{orders.by_category?.taxi || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-500" />
                    <span>Pochta</span>
                  </div>
                  <Badge variant="secondary">{orders.by_category?.parcel || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-orange-500" />
                    <span>Gruz</span>
                  </div>
                  <Badge variant="secondary">{orders.by_category?.cargo || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-purple-500" />
                    <span>Avia</span>
                  </div>
                  <Badge variant="secondary">{tickets.flight?.total || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4 text-indigo-500" />
                    <span>Poyezd</span>
                  </div>
                  <Badge variant="secondary">{tickets.train?.total || 0}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-3">Holat bo'yicha</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-yellow-600">{orders.by_status?.pending || 0}</div>
                <div className="text-sm text-muted-foreground">Kutmoqda</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-green-600">{orders.by_status?.accepted || 0}</div>
                <div className="text-sm text-muted-foreground">Qabul qilingan</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-red-600">{orders.by_status?.cancelled || 0}</div>
                <div className="text-sm text-muted-foreground">Bekor qilingan</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments and Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              To'lovlar
            </CardTitle>
            <CardDescription>
              To'lov so'rovlari statistikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Jami to'lovlar:</span>
                <Badge variant="outline">{payments.total || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Kutmoqda:</span>
                <Badge variant="secondary">{payments.pending || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Tasdiqlangan:</span>
                <Badge variant="default" className="bg-green-500">{payments.approved || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Rad etilgan:</span>
                <Badge variant="destructive">{payments.rejected || 0}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Jami to'langan ball:</span>
                  <span className="text-lg font-bold text-green-600">{payments.total_balls_paid || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Haydovchi arizalari
            </CardTitle>
            <CardDescription>
              Haydovchi arizalari statistikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Jami arizalar:</span>
                <Badge variant="outline">{applications.total || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Kutmoqda:</span>
                <Badge variant="secondary">{applications.pending || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Tasdiqlangan:</span>
                <Badge variant="default" className="bg-green-500">{applications.approved || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Rad etilgan:</span>
                <Badge variant="destructive">{applications.rejected || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets and Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Plane className="h-4 w-4" />
                <Train className="h-4 w-4" />
              </div>
              Bilet so'rovlari
            </CardTitle>
            <CardDescription>
              Avia va poyezd bilet so'rovlari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Avia biletlar</h4>
                <div className="flex items-center justify-between">
                  <span>Jami:</span>
                  <Badge variant="outline">{tickets.flight?.total || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kutmoqda:</span>
                  <Badge variant="secondary">{tickets.flight?.pending || 0}</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Poyezd biletlar</h4>
                <div className="flex items-center justify-between">
                  <span>Jami:</span>
                  <Badge variant="outline">{tickets.train?.total || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kutmoqda:</span>
                  <Badge variant="secondary">{tickets.train?.pending || 0}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Reytinglar
            </CardTitle>
            <CardDescription>
              Haydovchilar reytingi statistikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Jami reytinglar:</span>
                <Badge variant="outline">{ratings.total || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>O'rtacha reyting:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-600">{ratings.average || 0}</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            So'nggi faollik (7 kun)
          </CardTitle>
          <CardDescription>
            Oxirgi 7 kundagi faollik statistikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{recentActivity.orders || 0}</div>
              <div className="text-sm text-muted-foreground">Yangi buyurtmalar</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{recentActivity.payments || 0}</div>
              <div className="text-sm text-muted-foreground">To'lov so'rovlari</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{recentActivity.applications || 0}</div>
              <div className="text-sm text-muted-foreground">Haydovchi arizalari</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchStatistics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Yangilash
        </button>
      </div>
    </div>
  )
} 