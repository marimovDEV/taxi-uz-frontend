"use client"

import { memo, useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CreditCard,
  Package,
  Settings,
  TrendingUp,
  Car,
  Truck,
  Plane,
  Train,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  DollarSign,
  Bot,
  BarChart3,
  Calendar,
  Activity,
  TrendingDown,
  Zap,
  Eye,
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from "recharts"
import { apiService, Statistics } from "@/lib/api"

// Mock trading-style data for bot growth
const botTradingData = [
  {
    date: "2024-01-14",
    open: 120,
    high: 138,
    low: 115,
    close: 135,
    volume: 45,
    orders: 45,
    revenue: 450000,
    drivers: 25,
    change: 12.5,
  },
  {
    date: "2024-01-15",
    open: 135,
    high: 148,
    low: 132,
    close: 142,
    volume: 52,
    orders: 52,
    revenue: 520000,
    drivers: 27,
    change: 5.2,
  },
  {
    date: "2024-01-16",
    open: 142,
    high: 145,
    low: 138,
    close: 140,
    volume: 48,
    orders: 48,
    revenue: 480000,
    drivers: 28,
    change: -1.4,
  },
  {
    date: "2024-01-17",
    open: 140,
    high: 165,
    low: 138,
    close: 158,
    volume: 67,
    orders: 67,
    revenue: 670000,
    drivers: 30,
    change: 12.9,
  },
  {
    date: "2024-01-18",
    open: 158,
    high: 172,
    low: 155,
    close: 167,
    volume: 71,
    orders: 71,
    revenue: 710000,
    drivers: 32,
    change: 5.7,
  },
  {
    date: "2024-01-19",
    open: 167,
    high: 195,
    low: 164,
    close: 189,
    volume: 83,
    orders: 83,
    revenue: 830000,
    drivers: 35,
    change: 13.2,
  },
]

// Memoized stat card component
const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
  <Card className="mobile-card border-0 shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mobile-responsive-card">
      <CardTitle className="mobile-text font-medium leading-tight">{stat.title}</CardTitle>
      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${stat.bgColor}`}>
        <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
      </div>
    </CardHeader>
    <CardContent className="mobile-responsive-card pt-0">
      <div className="mobile-title font-bold">{stat.value}</div>
      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
    </CardContent>
  </Card>
))

StatCard.displayName = "StatCard"

// Trading-style price ticker component
const TradingTicker = memo(({ data }: { data: any }) => {
  const [isBlinking, setIsBlinking] = useState(false)
  const isPositive = data.change >= 0

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`mobile-responsive-card rounded-lg border-2 transition-all duration-200 ${
        isBlinking
          ? isPositive
            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
            : "border-red-400 bg-red-50 dark:bg-red-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className="font-bold mobile-text">BOT/UZS</span>
          <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
            {isPositive ? "BULL" : "BEAR"}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mobile-text">
        <div>
          <p className="text-xs text-muted-foreground">PRICE</p>
          <p className={`mobile-title font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {data.close.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">CHANGE</p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <span className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}
              {data.change.toFixed(1)}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">VOLUME</p>
          <p className="font-bold">{data.volume.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">HIGH/LOW</p>
          <p className="font-bold text-xs">
            <span className="text-green-600">{data.high}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="text-red-600">{data.low}</span>
          </p>
        </div>
      </div>
    </div>
  )
})

TradingTicker.displayName = "TradingTicker"

// OHLC Table component
const OHLCTable = memo(({ data }: { data: any }) => (
  <div className="bg-gray-900 text-white mobile-responsive-card rounded-lg font-mono mobile-text">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-green-400">MARKET DATA</h3>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-400">LIVE</span>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">OPEN:</span>
          <span className="text-blue-400">{data.open.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">HIGH:</span>
          <span className="text-green-400">{data.high.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">LOW:</span>
          <span className="text-red-400">{data.low.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">CLOSE:</span>
          <span className={data.change >= 0 ? "text-green-400" : "text-red-400"}>{data.close.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">VOLUME:</span>
          <span className="text-yellow-400">{data.volume.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">CHANGE:</span>
          <span className={data.change >= 0 ? "text-green-400" : "text-red-400"}>
            {data.change >= 0 ? "+" : ""}
            {data.change.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">ORDERS:</span>
          <span className="text-purple-400">{data.orders.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">REVENUE:</span>
          <span className="text-orange-400">{(data.revenue / 1000000).toFixed(1)}M</span>
        </div>
      </div>
    </div>
  </div>
))

OHLCTable.displayName = "OHLCTable"

// Trading metrics component
const TradingMetrics = memo(({ data }: { data: any[] }) => {
  const currentData = data[data.length - 1]
  const previousData = data[data.length - 2]

  const metrics = [
    {
      label: "MARKET CAP",
      value: `${((currentData.close * 1000000) / 1000000).toFixed(1)}M`,
      change: ((currentData.close - previousData.close) / previousData.close) * 100,
      icon: DollarSign,
    },
    {
      label: "VOLUME 24H",
      value: currentData.volume.toLocaleString(),
      change: ((currentData.volume - previousData.volume) / previousData.volume) * 100,
      icon: BarChart3,
    },
    {
      label: "ORDERS 24H",
      value: currentData.orders.toLocaleString(),
      change: ((currentData.orders - previousData.orders) / previousData.orders) * 100,
      icon: ShoppingCart,
    },
    {
      label: "DRIVERS",
      value: currentData.drivers.toLocaleString(),
      change: ((currentData.drivers - previousData.drivers) / previousData.drivers) * 100,
      icon: Users,
    },
  ]

  return (
    <div className="mobile-grid">
      {metrics.map((metric, index) => {
        const isPositive = metric.change >= 0
        return (
          <div
            key={metric.label}
            className="mobile-responsive-card bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {isPositive ? "+" : ""}
                  {metric.change.toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
            <p className="mobile-title font-bold">{metric.value}</p>
          </div>
        )
      })}
    </div>
  )
})

TradingMetrics.displayName = "TradingMetrics"

// Memoized service stat component
const ServiceStatItem = memo(({ service, index }: { service: any; index: number }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
        <service.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${service.color}`} />
      </div>
      <span className="font-medium mobile-text">{service.name}</span>
    </div>
    <span className="mobile-title font-bold">{service.count}</span>
  </div>
))

ServiceStatItem.displayName = "ServiceStatItem"

// Memoized activity item component
const ActivityItem = memo(({ activity }: { activity: any }) => (
  <div
    className={`flex items-start gap-3 mobile-responsive-card rounded-lg ${
      activity.type === "success"
        ? "bg-blue-50 dark:bg-blue-900/20"
        : activity.type === "error"
          ? "bg-red-50 dark:bg-red-900/20"
          : activity.type === "warning"
            ? "bg-yellow-50 dark:bg-yellow-900/20"
            : "bg-purple-50 dark:bg-purple-900/20"
    }`}
  >
    <div
      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-2 ${
        activity.type === "success"
          ? "bg-blue-500"
          : activity.type === "error"
            ? "bg-red-500"
            : activity.type === "warning"
              ? "bg-yellow-500"
              : "bg-purple-500"
      }`}
    ></div>
    <div className="flex-1 min-w-0">
      <p className="mobile-text font-medium leading-tight">{activity.text}</p>
      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
    </div>
  </div>
))

ActivityItem.displayName = "ActivityItem"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await apiService.getGeneralStatistics()
        setStats(data)
      } catch (err: any) {
        console.error('Error fetching statistics:', err)
        setError(err.response?.data?.message || 'Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Memoized static data
  const serviceStats = useMemo(
    () => [
      { name: "Taxi", count: stats?.orders_by_category?.taxi || 0, icon: Car, color: "text-yellow-600" },
      { name: "Pasilka", count: stats?.orders_by_category?.parcel || 0, icon: Package, color: "text-blue-600" },
      { name: "Gruz", count: stats?.orders_by_category?.cargo || 0, icon: Truck, color: "text-green-600" },
      { name: "Avia/Poyezd", count: (stats?.tickets?.flight?.total || 0) + (stats?.tickets?.train?.total || 0), icon: Plane, color: "text-purple-600" },
    ],
    [stats],
  )

  const recentActivities = useMemo(
    () => {
      if (!stats) return [];
      
      const activities = [];
      
      // Recent orders
      if (stats.recent_orders && stats.recent_orders.length > 0) {
        stats.recent_orders.slice(0, 3).forEach(order => {
          activities.push({
            id: order.id,
            text: `${t("newOrder")}: ${order.category_display} - ${order.from_location} → ${order.to_location}`,
            time: new Date(order.created_at).toLocaleString('uz-UZ'),
            type: "info"
          });
        });
      }
      
      // Recent payments
      if (stats.recent_payments && stats.recent_payments.length > 0) {
        stats.recent_payments.slice(0, 2).forEach(payment => {
          activities.push({
            id: payment.id + 1000,
            text: `${t("paymentRequest")}: ${payment.driver.full_name} - ${payment.amount} so'm`,
            time: new Date(payment.created_at).toLocaleString('uz-UZ'),
            type: payment.status === 'approved' ? "success" : payment.status === 'rejected' ? "error" : "warning"
          });
        });
      }
      
      return activities.slice(0, 5);
    },
    [stats],
  )

  // Current trading data - generate from real stats
  const currentTradingData = useMemo(() => {
    if (!stats) return null;
    
    const totalRevenue = stats.total_revenue || 0;
    const totalOrders = stats.total_orders || 0;
    const totalDrivers = stats.total_drivers || 0;
    
    return {
      date: new Date().toISOString().split('T')[0],
      open: totalOrders * 0.8,
      high: totalOrders * 1.2,
      low: totalOrders * 0.6,
      close: totalOrders,
      volume: totalOrders,
      orders: totalOrders,
      revenue: totalRevenue,
      drivers: totalDrivers,
      change: totalOrders > 0 ? ((totalOrders - (totalOrders * 0.9)) / (totalOrders * 0.9)) * 100 : 0,
    };
  }, [stats]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="mobile-title font-bold tracking-tight">{t("dashboardTitle")}</h1>
        <p className="mobile-text text-muted-foreground">{t("dashboardDesc")}</p>
      </div>

      {/* Main Stats */}
      <div className="mobile-grid">
        {stats && (
          <>
            <StatCard stat={{ title: t("totalDrivers"), value: stats.total_drivers, description: `${t("approved")}: ${stats.total_drivers - stats.pending_applications}`, icon: Users, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20" }} />
            <StatCard stat={{ title: t("paymentRequests"), value: stats.total_payments, description: `${t("pending")}: ${stats.pending_payments}`, icon: CreditCard, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/20" }} />
            <StatCard stat={{ title: t("totalOrders"), value: stats.total_orders, description: `${t("today")}: ${stats.total_orders}`, icon: Package, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/20" }} />
            <StatCard stat={{ title: t("activeGroups"), value: stats.total_users, description: t("allServices"), icon: Settings, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/20" }} />
          </>
        )}
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {stats && (
          <>
            <StatCard stat={{ 
              title: t("aviaTickets"), 
              value: stats.tickets?.flight?.total || 0, 
              description: `${t("waiting")}: ${stats.tickets?.flight?.pending || 0}`, 
              icon: Plane, 
              color: "text-purple-600", 
              bgColor: "bg-purple-100 dark:bg-purple-900/20" 
            }} />
            <StatCard stat={{ 
              title: t("trainTickets"), 
              value: stats.tickets?.train?.total || 0, 
              description: `${t("waiting")}: ${stats.tickets?.train?.pending || 0}`, 
              icon: Train, 
              color: "text-indigo-600", 
              bgColor: "bg-indigo-100 dark:bg-indigo-900/20" 
            }} />
          </>
        )}
      </div>

      {/* Trading-Style Bot Growth Statistics */}
      <Card className="mobile-card border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="mobile-responsive-card">
          <CardTitle className="flex items-center gap-2 mobile-text">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            {t("botTradingAnalytics")}
            <Badge className="bg-green-500 text-white text-xs animate-pulse">LIVE</Badge>
          </CardTitle>
          <CardDescription className="mobile-text">{t("professionalTradingStyle")}</CardDescription>
        </CardHeader>
        <CardContent className="mobile-responsive-card pt-0 space-y-6">
          {/* Trading Ticker */}
          {currentTradingData ? (
            <TradingTicker data={currentTradingData} />
          ) : (
            <div className="bg-gray-900 mobile-responsive-card rounded-lg text-center">
              <div className="text-gray-400">{t("dataLoading")}</div>
            </div>
          )}

          {/* Trading Chart */}
          {currentTradingData ? (
            <div className="bg-gray-900 mobile-responsive-card rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold mobile-text">BOT/UZS</h3>
                  <Badge className="bg-green-500 text-white text-xs">1D</Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                    +{currentTradingData.change.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="h-3 w-3" />
                  <span>{t("realTime")}</span>
                </div>
              </div>

            <div className="mobile-chart">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={botTradingData}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis yAxisId="price" orientation="right" stroke="#9ca3af" fontSize={12} />
                  <YAxis yAxisId="volume" orientation="left" stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString("uz-UZ")}
                    formatter={(value: any, name: string) => [
                      name === "volume"
                        ? value
                        : name === "close"
                          ? `${value} (${name.toUpperCase()})`
                          : `${value} (${name.toUpperCase()})`,
                      name === "volume"
                        ? "Volume"
                        : name === "close"
                          ? "Close Price"
                          : name === "high"
                            ? "High"
                            : name === "low"
                              ? "Low"
                              : "Open",
                    ]}
                  />

                  {/* Volume bars */}
                  <Bar yAxisId="volume" dataKey="volume" fill="url(#volumeGradient)" opacity={0.7} />

                  {/* Price lines */}
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="high"
                    stroke="#10b981"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="2 2"
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="low"
                    stroke="#ef4444"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="2 2"
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          ) : (
            <div className="bg-gray-900 mobile-responsive-card rounded-lg text-center">
              <div className="text-gray-400">{t("chartDataLoading")}</div>
            </div>
          )}

          {/* OHLC Table and Trading Metrics */}
          {currentTradingData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* OHLC Table */}
              <div className="bg-gray-900 mobile-responsive-card rounded-lg">
                <h4 className="text-white font-bold mb-3 mobile-text">{t("ohlcData")}</h4>
                <div className="space-y-2 mobile-text">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("open")}:</span>
                    <span className="text-white">{currentTradingData.open.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("high")}:</span>
                    <span className="text-green-400">{currentTradingData.high.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("low")}:</span>
                    <span className="text-red-400">{currentTradingData.low.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("close")}:</span>
                    <span className="text-white font-bold">{currentTradingData.close.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Trading Metrics */}
              <div className="bg-gray-900 mobile-responsive-card rounded-lg">
                <h4 className="text-white font-bold mb-3 mobile-text">{t("tradingMetrics")}</h4>
                <div className="space-y-2 mobile-text">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("volume")}:</span>
                    <span className="text-blue-400">{currentTradingData.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("revenue")}:</span>
                    <span className="text-green-400">{currentTradingData.revenue.toLocaleString()} UZS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("drivers")}:</span>
                    <span className="text-yellow-400">{currentTradingData.drivers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("change")}:</span>
                    <span className={`font-bold ${currentTradingData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currentTradingData.change >= 0 ? '+' : ''}{currentTradingData.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 mobile-responsive-card rounded-lg text-center">
              <div className="text-gray-400">{t("metricsLoading")}</div>
            </div>
          )}

          {/* Trading Summary */}
          {currentTradingData ? (
            <div className="bg-gray-900 mobile-responsive-card rounded-lg">
              <h4 className="text-white font-bold mb-3 mobile-text">{t("tradingSummary")}</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mobile-text">
                                  <div className="text-center">
                    <div className="text-gray-400">{t("totalOrdersLabel")}</div>
                    <div className="text-white font-bold mobile-title">{currentTradingData.orders.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">{t("totalRevenueLabel")}</div>
                    <div className="text-green-400 font-bold mobile-title">{currentTradingData.revenue.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">{t("activeDriversLabel")}</div>
                    <div className="text-blue-400 font-bold mobile-title">{currentTradingData.drivers}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">{t("dailyChange")}</div>
                    <div className={`font-bold mobile-title ${currentTradingData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currentTradingData.change >= 0 ? '+' : ''}{currentTradingData.change.toFixed(1)}%
                    </div>
                  </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 mobile-responsive-card rounded-lg text-center">
              <div className="text-gray-400">{t("tradingSummaryLoading")}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Statistics */}
      <div className="mobile-grid">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="mobile-card border-0 shadow-md">
              <CardContent className="mobile-responsive-card">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          serviceStats.map((service) => (
            <Card key={service.name} className="mobile-card border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="mobile-responsive-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mobile-text font-medium text-muted-foreground">{service.name}</p>
                    <p className="mobile-title font-bold">{service.count.toLocaleString()}</p>
                  </div>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <Card className="mobile-card border-0 shadow-md">
        <CardHeader className="mobile-responsive-card">
          <CardTitle className="flex items-center gap-2 mobile-text">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("recentActivity")}
          </CardTitle>
          <CardDescription className="mobile-text">{t("recentActivityDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="mobile-responsive-card pt-0">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex-1 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="mobile-text text-muted-foreground">{t("noActivityYet")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="mobile-card border-0 shadow-md">
        <CardHeader className="mobile-responsive-card">
          <CardTitle className="flex items-center gap-2 mobile-text">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("performanceSummary")}
          </CardTitle>
          <CardDescription className="mobile-text">{t("performanceSummaryDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="mobile-responsive-card pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="mobile-text font-medium">{t("todayActivity")}</span>
              </div>
              <p className="mobile-title font-bold text-blue-600">87%</p>
              <Progress value={87} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">{t("yesterday")}: 82%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="mobile-text font-medium">{t("onlineDrivers")}</span>
              </div>
              <p className="mobile-title font-bold text-green-600">234</p>
              <Progress value={78} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">{t("total")}: 300 ta</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="mobile-text font-medium">{t("completionRate")}</span>
              </div>
              <p className="mobile-title font-bold text-purple-600">94.2%</p>
              <Progress value={94.2} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">{t("target")}: 95%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
