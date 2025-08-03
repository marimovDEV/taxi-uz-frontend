"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Check, X, Ban, UserX, Phone, Car, FileText, Camera, Star } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useDebouncedSearch } from "@/hooks/use-debounced-search"
import { OptimizedTable } from "@/components/optimized-table"
import { apiService, DriverApplication } from "@/lib/api"
import { useEffect } from "react"
import BotTokenInput from "@/components/BotTokenInput"

interface Driver {
  id: number
  application_id: string
  user: {
    id: number
    username: string
    full_name: string
    phone: string
    role: string
    balls: number
    language: string
    status: string
    address: string
    travel_route: string
    date_joined: string
  }
  full_name: string
  phone: string
  car_model: string
  car_number: string
  car_year: number
  direction: 'taxi' | 'cargo'
  direction_display: string
  cargo_capacity: number
  passport_file_id: string
  license_file_id: string
  sts_file_id: string
  car_photo_file_id: string
  passport_image_url: string | null
  license_image_url: string | null
  sts_image_url: string | null
  car_photo_url: string | null
  assigned_admin_id: number
  assigned_admin_username: string
  assigned_at: string
  status: 'pending' | 'assigned' | 'approved' | 'rejected'
  status_display: string
  rejection_reason: string
  created_at: string
  updated_at: string
  reviewed_at: string
  invite_link_sent: boolean
  // Frontend uchun qo'shimcha maydonlar
  balls?: number
  taxiScore?: number
  pasilkaScore?: number
  gruzScore?: number
  inGroup?: boolean
  rating?: number
  totalRatings?: number
  ratingBreakdown?: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  recentReviews?: Array<{
    id: number
    customerName: string
    rating: number
    comment: string
    date: string
    orderType: string
  }>
  totalOrders?: number
  completedOrders?: number
}

// Memoized image viewer component
const ImageViewer = memo(({ src, alt, title }: { src: string | null; alt: string; title: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="space-y-2">
        <Label className="mobile-text font-medium">{title}</Label>
        <div
          className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
          onClick={() => src && setIsOpen(true)}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-gray-50">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          {src && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="mobile-modal max-w-4xl">
          <DialogHeader>
            <DialogTitle className="mobile-text">{title}</DialogTitle>
          </DialogHeader>
          {src && (
            <div className="flex justify-center">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
})

ImageViewer.displayName = "ImageViewer"

// Star Rating Component
const StarRating = memo(({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
})

StarRating.displayName = "StarRating"

// Rating Progress Bar Component
const RatingProgressBar = memo(({ stars, count, total }: { stars: number; count: number; total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 text-right">{stars}</span>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-xs text-muted-foreground">{count}</span>
    </div>
  )
})

RatingProgressBar.displayName = "RatingProgressBar"

// Memoized mobile card component
const MobileDriverCard = memo(({ driver, onAction }: { driver: Driver; onAction: any }) => {
  const getStatusBadge = useCallback((status: Driver["status"]) => {
    const variants = {
      pending: "default",
      assigned: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status === 'pending' ? 'Kutilmoqda' : 
         status === 'assigned' ? 'Tayinlangan' : 
         status === 'approved' ? 'Tasdiqlangan' : 
         status === 'rejected' ? 'Rad etilgan' : status}
      </Badge>
    )
  }, [])

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{driver.full_name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{driver.phone}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Car className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {driver.car_model} • {driver.car_number}
                </span>
              </div>
              {driver.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <StarRating rating={Math.round(driver.rating)} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {driver.rating.toFixed(1)} ({driver.totalRatings})
                  </span>
                </div>
              )}
            </div>
            {getStatusBadge(driver.status)}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Kategoriya:</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {driver.direction_display}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Guruhda:</span>
              <Badge
                className={`ml-1 text-xs ${
                  driver.inGroup ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {driver.inGroup ? "✅" : "❌"}
              </Badge>
            </div>
          </div>

          {/* Scores */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-1">Ballar:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                Taxi: <span className="font-semibold">{driver.taxiScore}</span>
              </div>
              <div>
                Pasilka: <span className="font-semibold">{driver.pasilkaScore}</span>
              </div>
              <div>
                Gruz: <span className="font-semibold">{driver.gruzScore}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent"
              onClick={() => onAction("view", driver)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ko'rish
            </Button>

            {driver.status === "pending" && (
              <Button size="sm" className="h-8 text-xs" onClick={() => onAction("approve", driver)}>
                <Check className="h-3 w-3 mr-1" />
                Tasdiqlash
              </Button>
            )}

            {driver.status === "approved" && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onAction("ban", driver)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Ban
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

MobileDriverCard.displayName = "MobileDriverCard"

export default function DriversPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Driver["status"] | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<Driver["direction"] | "all">("all")
  const [ballAmount, setBallAmount] = useState<number>(0)
  const [botToken, setBotToken] = useState<string>(process.env.NEXT_PUBLIC_BOT_TOKEN || '')

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        const { results } = await apiService.getDriverApplications()
        setDrivers(results)
      } catch (error) {
        toast({ title: t("error"), description: t("driversLoadingError"), variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [toast])

  // Load bot token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('bot_token')
    if (savedToken) {
      setBotToken(savedToken)
    }
  }, [])

  const handleViewDriver = async (driver: Driver) => {
    try {
      // Fetch detailed driver information
      const detailedDriver = await apiService.getDriverDetail(driver.user.id)
      setSelectedDriver(detailedDriver)
    } catch (error) {
      toast({ title: t("error"), description: t("driverDetailsLoadingError"), variant: "destructive" })
    }
  }

  const handleAddBalls = async () => {
    if (!selectedDriver || ballAmount <= 0) {
      toast({ title: t("error"), description: t("correctBallAmount"), variant: "destructive" })
      return
    }

    try {
      const result = await apiService.addBallsToDriver(selectedDriver.user.id, ballAmount)
      
      // Update the selected driver with new ball balance
      setSelectedDriver(prev => prev ? { ...prev, balls: result.new_balance } : null)
      
      // Update the driver in the list
      setDrivers(prev => prev.map(d => 
        d.user.id === selectedDriver.user.id 
          ? { ...d, user: { ...d.user, balls: result.new_balance } }
          : d
      ))
      
      toast({ title: t("success"), description: result.message })
      setBallAmount(0)
    } catch (error) {
      toast({ title: t("error"), description: t("ballAddError"), variant: "destructive" })
    }
  }

  // Debounced search
  const searchedDrivers = useDebouncedSearch(drivers, searchTerm, ["full_name", "phone", "car_model", "car_number"], 300)

  // Filtered data with memoization
  const filteredDrivers = useMemo(() => {
    return searchedDrivers.filter((driver) => {
      const matchesStatus = statusFilter === "all" || driver.status === statusFilter
      const matchesCategory = categoryFilter === "all" || driver.direction === categoryFilter
      return matchesStatus && matchesCategory
    })
  }, [searchedDrivers, statusFilter, categoryFilter])

  // Memoized action handlers
  const handleAction = async (action: string, driver: Driver) => {
    try {
      switch (action) {
        case "view":
          handleViewDriver(driver)
          break
        case "approve":
          await apiService.approveDriverApplication(driver.id, 'approve')
          setDrivers((prev) =>
            prev.map((d) => (d.id === driver.id ? { ...d, status: "approved" as const, inGroup: true } : d)),
          )
          toast({ title: t("driverApproved"), description: t("inviteLinkSent") })
          break
        case "ban":
          await apiService.approveDriverApplication(driver.id, 'reject', { rejection_reason: 'Admin tomonidan ban qilindi' })
          setDrivers((prev) =>
            prev.map((d) => (d.id === driver.id ? { ...d, status: "rejected" as const, inGroup: false } : d)),
          )
          toast({ title: t("driverBanned"), description: t("driverRemovedFromGroup") })
          break
      }
    } catch (error) {
              toast({ title: t("error"), description: t("actionError"), variant: "destructive" })
    }
  }

  // Memoized mobile card renderer
  const renderMobileCard = useCallback(
    (driver: Driver) => (
      <div key={driver.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{driver.full_name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{driver.phone}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Car className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {driver.car_model} • {driver.car_number}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground">Kategoriya:</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {driver.direction_display}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">Holat:</span>
              <Badge variant={
                driver.status === "approved"
                  ? "default"
                  : driver.status === "rejected"
                    ? "destructive"
                    : "secondary"
              }>
                {driver.status_display}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-1 ml-4">
            <Button size="sm" className="h-8 text-xs" onClick={() => handleAction("view", driver)}>
              <Eye className="h-3 w-3 mr-1" />
              Ko'rish
            </Button>

            {driver.status === "pending" && (
              <Button size="sm" className="h-8 text-xs" onClick={() => handleAction("approve", driver)}>
                <Check className="h-3 w-3 mr-1" />
                Tasdiqlash
              </Button>
            )}

            {driver.status === "approved" && (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleAction("ban", driver)}
              >
                <X className="h-3 w-3 mr-1" />
                Ban
              </Button>
            )}
          </div>
        </div>
      </div>
    ),
    [handleAction],
  )

  // Memoized table columns
  const tableColumns = useMemo(
    () => [
      {
        key: "name",
        header: t("name"),
        render: (driver: Driver) => (
          <div>
            <div className="font-medium">{driver.full_name}</div>
            <div className="text-sm text-muted-foreground">{driver.phone}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Car className="h-3 w-3" />
              {driver.car_model} • {driver.car_number}
            </div>
            {driver.rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-400" />
                <span className="text-xs">{driver.rating}</span>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "balls",
        header: "Ball",
        render: (driver: Driver) => (
          <div className="text-center">
            <div className="font-bold text-blue-600">{driver.user.balls || 0}</div>
            <div className="text-xs text-muted-foreground">ball</div>
          </div>
        ),
      },
      {
        key: "category",
        header: t("category"),
        render: (driver: Driver) => <Badge variant="outline">{driver.direction_display}</Badge>,
      },
      {
        key: "status",
        header: t("status"),
        render: (driver: Driver) => {
          const variants = {
            pending: "default",
            assigned: "secondary",
            approved: "default",
            rejected: "destructive",
          } as const
          return (
            <Badge variant={variants[driver.status]} className="text-xs">
              {driver.status_display}
            </Badge>
          )
        },
      },
      {
        key: "scores",
        header: t("scores"),
        render: (driver: Driver) => (
          <div className="text-sm">
            <div>Taxi: {driver.taxiScore}</div>
            <div>Pasilka: {driver.pasilkaScore}</div>
            <div>Gruz: {driver.gruzScore}</div>
          </div>
        ),
      },
      {
        key: "inGroup",
        header: t("inGroup"),
        render: (driver: Driver) =>
          driver.inGroup ? (
            <Badge className="bg-green-100 text-green-800">✅</Badge>
          ) : (
            <Badge variant="secondary">❌</Badge>
          ),
      },
      {
        key: "actions",
        header: t("actions"),
        render: (driver: Driver) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleAction("view", driver)}>
              <Eye className="h-4 w-4" />
            </Button>
            {driver.status === "rejected" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("approve", driver)}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {driver.status === "approved" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction("ban", driver)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Ban className="h-4 w-4" />
                </Button>
                {driver.inGroup && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction("kick", driver)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    [t, handleAction],
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("driversTitle")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("driversDesc")}</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">{t("driversList")}</CardTitle>
          <CardDescription className="text-sm">{t("driversListDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {/* Filters */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ism, telefon, avtomobil modeli yoki raqami bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t("status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="assigned">{t("assigned")}</SelectItem>
                  <SelectItem value="approved">{t("approved")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories")}</SelectItem>
                  <SelectItem value="taxi">Taxi</SelectItem>
                  <SelectItem value="cargo">Cargo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optimized Table */}
          <OptimizedTable
            data={filteredDrivers}
            columns={tableColumns}
            renderMobileCard={renderMobileCard}
            keyExtractor={(driver) => driver.id}
            pageSize={50}
          />
        </CardContent>
      </Card>

      {/* Enhanced Profile Dialog */}
      <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Haydovchi profili
            </DialogTitle>
          </DialogHeader>

          {selectedDriver && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ism familya</Label>
                  <p className="text-base font-semibold">{selectedDriver.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Telefon</Label>
                  <p className="text-base">{selectedDriver.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tug'ilgan sana</Label>
                  <p className="text-base">{selectedDriver.user.date_joined}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kategoriya</Label>
                  <Badge variant="outline" className="mt-1">
                    {selectedDriver.direction_display}
                  </Badge>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Manzil</Label>
                  <p className="text-base">{selectedDriver.user.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Holat</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedDriver.status === "approved"
                          ? "default"
                          : selectedDriver.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {selectedDriver.status_display}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Car Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Avtomobil ma'lumotlari
                  </Label>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Avtomobil rusumi</Label>
                  <p className="text-base font-semibold">{selectedDriver.car_model}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Avtomobil raqami</Label>
                  <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                    {selectedDriver.car_number}
                  </p>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="col-span-3">
                  <Label className="text-sm font-medium text-green-700 dark:text-green-300">Ball statistikasi</Label>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selectedDriver.taxiScore}</p>
                  <p className="text-xs text-muted-foreground">Taxi</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedDriver.pasilkaScore}</p>
                  <p className="text-xs text-muted-foreground">Pasilka</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedDriver.gruzScore}</p>
                  <p className="text-xs text-muted-foreground">Gruz</p>
                </div>
              </div>

              {/* Rating Section */}
              {selectedDriver.rating > 0 ? (
                <div className="space-y-4">
                  <Label className="text-base font-medium mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    Haydovchi reytingi
                  </Label>

                  {/* Overall Rating */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                        <span className="text-4xl font-bold text-yellow-600">{selectedDriver.rating.toFixed(1)}</span>
                        <div>
                          <StarRating rating={Math.round(selectedDriver.rating)} size="lg" />
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedDriver.totalRatings} ta baholash
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <RatingProgressBar
                          key={stars}
                          stars={stars}
                          count={selectedDriver.ratingBreakdown?.[stars as keyof typeof selectedDriver.ratingBreakdown]}
                          total={selectedDriver.totalRatings}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  {selectedDriver.recentReviews && selectedDriver.recentReviews.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-3 block">So'nggi izohlar</Label>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedDriver.recentReviews.map((review) => (
                          <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-sm">{review.customerName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={review.rating} size="sm" />
                                  <Badge variant="outline" className="text-xs">
                                    {review.orderType}
                                  </Badge>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Hali baholanmagan</p>
                </div>
              )}

              {/* Document Images */}
              <div>
                <Label className="text-base font-medium mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Hujjat rasmlari
                </Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ImageViewer
                    src={selectedDriver.passport_image_url || "/placeholder.svg"}
                    alt="Pasport rasmi"
                    title="Pasport rasmi"
                  />
                  <ImageViewer
                    src={selectedDriver.license_image_url || "/placeholder.svg"}
                    alt="Prava rasmi"
                    title="Haydovchilik guvohnomasi"
                  />
                  <ImageViewer
                    src={selectedDriver.sts_image_url || "/placeholder.svg"}
                    alt="STS rasmi"
                    title="STS (Avtomobil guvohnomasi)"
                  />
                  <ImageViewer
                    src={selectedDriver.car_photo_url || "/placeholder.svg"}
                    alt="Avtomobil rasmi"
                    title="Avtomobil rasmi"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Guruhda</Label>
                  <div className="mt-1">
                    {selectedDriver.inGroup ? (
                      <Badge className="bg-green-100 text-green-800">✅ Guruhda</Badge>
                    ) : (
                      <Badge variant="secondary">❌ Guruhda emas</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Label className="text-sm font-medium text-muted-foreground">Umumiy ball</Label>
                  <p className="text-xl font-bold text-primary">
                    {(selectedDriver.taxiScore || 0) + (selectedDriver.pasilkaScore || 0) + (selectedDriver.gruzScore || 0)}
                  </p>
                </div>
              </div>

              {/* Ball Balance */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4" />
                  Ball balansi
                </Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedDriver.balls || 0} ball
                    </p>
                    <p className="text-sm text-muted-foreground">Joriy balans</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Buyurtmalar</p>
                    <p className="text-lg font-semibold">
                      {selectedDriver.totalOrders || 0} / {selectedDriver.completedOrders || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ball Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Ball qo'shish
                  </Label>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Qo'shiladigan ball miqdori</Label>
                  <Input
                    type="number"
                    value={ballAmount}
                    onChange={(e) => setBallAmount(Number(e.target.value))}
                    className="w-full text-sm"
                  />
                </div>
                <Button
                  onClick={handleAddBalls}
                  className="h-10 text-sm"
                  disabled={!selectedDriver || ballAmount <= 0}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Ball qo'shish
                </Button>
              </div>

              {/* Bot Token Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Bot Token</Label>
                <BotTokenInput
                  value={botToken}
                  onChange={(value) => {
                    setBotToken(value)
                    // Update environment variable (this will only work in development)
                    if (typeof window !== 'undefined') {
                      window.localStorage.setItem('bot_token', value)
                    }
                  }}
                  placeholder="Bot token kiriting..."
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Token ko'rish uchun ko'z ikonkasini bosing</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(botToken)
                      toast({ title: "Token nusxalandi", description: "Bot token panjara nusxalandi" })
                    }}
                    disabled={!botToken}
                  >
                    Nusxalash
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
