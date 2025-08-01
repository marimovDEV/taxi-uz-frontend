"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Car, Package, Truck, Plane, Train, MapPin, Calendar, User, Phone, Loader2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { apiService, Order, FlightTicket, TrainTicket } from "@/lib/api"

export default function OrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [flightTickets, setFlightTickets] = useState<FlightTicket[]>([])
  const [trainTickets, setTrainTickets] = useState<TrainTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedFlightTicket, setSelectedFlightTicket] = useState<FlightTicket | null>(null)
  const [selectedTrainTicket, setSelectedTrainTicket] = useState<TrainTicket | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const [ordersResponse, flightTicketsResponse, trainTicketsResponse] = await Promise.all([
        apiService.getOrders(),
        apiService.getFlightTickets(),
        apiService.getTrainTickets()
      ])
      setOrders(ordersResponse.results)
      setFlightTickets(flightTicketsResponse.results)
      setTrainTickets(trainTicketsResponse.results)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: t("error"),
        description: t("ordersLoadingError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (category: Order["category"] | "flight" | "train") => {
    const icons = {
      taxi: Car,
      parcel: Package,
      cargo: Truck,
      flight: Plane,
      train: Train,
    }
    return icons[category]
  }

  const getServiceColor = (category: Order["category"] | "flight" | "train") => {
    const colors = {
      taxi: "text-yellow-600",
      parcel: "text-blue-600",
      cargo: "text-green-600",
      flight: "text-purple-600",
      train: "text-orange-600",
    }
    return colors[category]
  }

  const getServiceDisplayName = (category: Order["category"] | "flight" | "train") => {
    const names = {
      taxi: t("taxi"),
      parcel: t("parcel"),
      cargo: t("cargo"),
      flight: t("flightTicket"),
      train: t("trainTicket"),
    }
    return names[category]
  }

  const getStatusBadge = (status: Order["status"]) => {
    if (status === "accepted") {
      return <Badge className="bg-green-100 text-green-800">{t("accepted")}</Badge>
    } else if (status === "cancelled") {
      return <Badge className="bg-red-100 text-red-800">{t("cancelled")}</Badge>
    } else {
      return <Badge variant="secondary">{t("waiting")}</Badge>
    }
  }

  const filterOrdersByService = (service: string) => {
    if (service === "all") return orders
    if (service === "taxi") return orders.filter((o) => o.category === "taxi")
    if (service === "parcel") return orders.filter((o) => o.category === "parcel")
    if (service === "cargo") return orders.filter((o) => o.category === "cargo")
    if (service === "flight") return flightTickets
    if (service === "train") return trainTickets
    return orders
  }

  const filteredOrders = filterOrdersByService(activeTab).filter(
    (order) => {
      const searchLower = searchTerm.toLowerCase()
      if ('client' in order) {
        // Regular orders
        return (
          order.client.full_name.toLowerCase().includes(searchLower) ||
      order.client.phone.includes(searchTerm) ||
          order.from_location.toLowerCase().includes(searchLower) ||
          order.to_location.toLowerCase().includes(searchLower) ||
          (order.description && order.description.toLowerCase().includes(searchLower))
        )
      } else {
        // Flight/Train tickets
        return (
          order.full_name.toLowerCase().includes(searchLower) ||
          order.phone.includes(searchTerm) ||
          order.from_location.toLowerCase().includes(searchLower) ||
          order.to_location.toLowerCase().includes(searchLower) ||
          (order.description && order.description.toLowerCase().includes(searchLower)) ||
          order.ticket_id.toLowerCase().includes(searchLower)
        )
      }
    }
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Buyurtmalar yuklanmoqda...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buyurtmalar</h1>
        <p className="text-muted-foreground">Barcha xizmatlar bo'yicha buyurtmalar boshqaruvi</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Buyurtmalar ro'yxati</CardTitle>
          <CardDescription>Barcha buyurtmalar ({orders.length} ta)</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("searchOrders")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-7">
                              <TabsTrigger value="all">{t("all")} ({orders.length + flightTickets.length + trainTickets.length})</TabsTrigger>
                        <TabsTrigger value="taxi">{t("taxi")} ({orders.filter(o => o.category === 'taxi').length})</TabsTrigger>
          <TabsTrigger value="parcel">{t("parcel")} ({orders.filter(o => o.category === 'parcel').length})</TabsTrigger>
          <TabsTrigger value="cargo">{t("cargo")} ({orders.filter(o => o.category === 'cargo').length})</TabsTrigger>
          <TabsTrigger value="flight">{t("flightTicket")} ({flightTickets.length})</TabsTrigger>
                              <TabsTrigger value="train">{t("trainTicket")} ({trainTickets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Xizmat</TableHead>
                      <TableHead>Yo'nalish</TableHead>
                      <TableHead>Mijoz</TableHead>
                      <TableHead>Sana</TableHead>
                      <TableHead>Holat</TableHead>
                      <TableHead>Qo'shimcha</TableHead>
                      <TableHead>Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Buyurtmalar topilmadi
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((item) => {
                        const isTicket = 'ticket_id' in item
                        const category = isTicket ? (activeTab === 'flight' ? 'flight' : 'train') : item.category
                        const ServiceIcon = getServiceIcon(category)
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ServiceIcon className={`h-4 w-4 ${getServiceColor(category)}`} />
                                <Badge variant="outline">{getServiceDisplayName(category)}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span>
                                  {item.from_location} → {item.to_location}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {isTicket ? item.full_name : item.client.full_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {isTicket ? item.phone : item.client.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>
                                  {isTicket 
                                    ? (item.travel_date_formatted || formatDate(item.travel_date))
                                    : (item.date_formatted || formatDate(item.date))
                                  }
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {isTicket ? (
                                <Badge className={item.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                  item.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}>
                                  {item.status_display}
                                </Badge>
                              ) : (
                                getStatusBadge(item.status)
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-muted-foreground">
                                {isTicket ? (
                                  <div>🎫 {item.ticket_id}</div>
                                ) : (
                                  <>
                                    {item.category === 'taxi' && item.passengers && (
                                      <div>👥 {item.passengers} kishi</div>
                                    )}
                                    {item.category === 'parcel' && item.parcel_content && (
                                      <div>📦 {item.parcel_content}</div>
                                    )}
                                    {item.category === 'cargo' && item.cargo_type && (
                                      <div>🚚 {item.cargo_type}</div>
                                    )}
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => {
                                    if (isTicket) {
                                      if (activeTab === 'flight') {
                                        setSelectedFlightTicket(item as FlightTicket)
                                      } else {
                                        setSelectedTrainTicket(item as TrainTicket)
                                      }
                                    } else {
                                      setSelectedOrder(item as Order)
                                    }
                                  }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {isTicket ? t("ticketDetails") : t("orderDetails")}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {isTicket ? (
                                    activeTab === 'flight' && selectedFlightTicket ? (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>{t("serviceType")}</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Plane className="h-4 w-4 text-purple-600" />
                                              <span className="text-sm">{t("flightTicket")}</span>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>{t("status")}</Label>
                                            <div className="mt-1">
                                              <Badge className={selectedFlightTicket.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                              selectedFlightTicket.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                              'bg-yellow-100 text-yellow-800'}>
                                                {selectedFlightTicket.status_display}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>{t("ticketId")}</Label>
                                            <p className="text-sm mt-1">{selectedFlightTicket.ticket_id}</p>
                                          </div>
                                          <div>
                                            <Label>{t("from")}</Label>
                                            <p className="text-sm mt-1">{selectedFlightTicket.from_location}</p>
                                          </div>
                                          <div>
                                            <Label>{t("to")}</Label>
                                            <p className="text-sm mt-1">{selectedFlightTicket.to_location}</p>
                                          </div>
                                          <div>
                                            <Label>{t("travelDate")}</Label>
                                            <p className="text-sm mt-1">{selectedFlightTicket.travel_date_formatted || formatDate(selectedFlightTicket.travel_date)}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <Label>Mijoz ma'lumotlari</Label>
                                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <span className="font-medium">{selectedFlightTicket.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <Phone className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">{selectedFlightTicket.phone}</span>
                                            </div>
                                            {selectedFlightTicket.passport_number && (
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm">🪪 {selectedFlightTicket.passport_number}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <Label>Tavsif</Label>
                                          <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            {selectedFlightTicket.description || "Tavsif yo'q"}
                                          </p>
                                        </div>

                                        {selectedFlightTicket.admin_comment && (
                                          <div>
                                            <Label>Admin izohi</Label>
                                            <p className="text-sm mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                              {selectedFlightTicket.admin_comment}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ) : selectedTrainTicket ? (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Xizmat turi</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Train className="h-4 w-4 text-orange-600" />
                                              <span className="text-sm">Poyezd bileti</span>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>Holat</Label>
                                            <div className="mt-1">
                                              <Badge className={selectedTrainTicket.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                              selectedTrainTicket.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                              'bg-yellow-100 text-yellow-800'}>
                                                {selectedTrainTicket.status_display}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>Bilet ID</Label>
                                            <p className="text-sm mt-1">{selectedTrainTicket.ticket_id}</p>
                                          </div>
                                          <div>
                                            <Label>Qayerdan</Label>
                                            <p className="text-sm mt-1">{selectedTrainTicket.from_location}</p>
                                          </div>
                                          <div>
                                            <Label>Qayerga</Label>
                                            <p className="text-sm mt-1">{selectedTrainTicket.to_location}</p>
                                          </div>
                                          <div>
                                            <Label>Sayohat sanasi</Label>
                                            <p className="text-sm mt-1">{selectedTrainTicket.travel_date_formatted || formatDate(selectedTrainTicket.travel_date)}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <Label>Mijoz ma'lumotlari</Label>
                                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <span className="font-medium">{selectedTrainTicket.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <Phone className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">{selectedTrainTicket.phone}</span>
                                            </div>
                                            {selectedTrainTicket.passport_number && (
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm">🪪 {selectedTrainTicket.passport_number}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <Label>Tavsif</Label>
                                          <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            {selectedTrainTicket.description || "Tavsif yo'q"}
                                          </p>
                                        </div>

                                        {selectedTrainTicket.admin_comment && (
                                          <div>
                                            <Label>Admin izohi</Label>
                                            <p className="text-sm mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                              {selectedTrainTicket.admin_comment}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ) : null
                                  ) : selectedOrder ? (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Xizmat turi</Label>
                                          <div className="flex items-center gap-2 mt-1">
                                            {(() => {
                                              const ServiceIcon = getServiceIcon(selectedOrder.category)
                                              return (
                                                <ServiceIcon
                                                  className={`h-4 w-4 ${getServiceColor(selectedOrder.category)}`}
                                                />
                                              )
                                            })()}
                                            <span className="text-sm">{getServiceDisplayName(selectedOrder.category)}</span>
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Holat</Label>
                                          <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                        </div>
                                        <div>
                                          <Label>Qayerdan</Label>
                                          <p className="text-sm mt-1">{selectedOrder.from_location}</p>
                                        </div>
                                        <div>
                                          <Label>Qayerga</Label>
                                          <p className="text-sm mt-1">{selectedOrder.to_location}</p>
                                        </div>
                                        <div>
                                          <Label>Sana</Label>
                                          <p className="text-sm mt-1">{selectedOrder.date_formatted || formatDate(selectedOrder.date)}</p>
                                        </div>
                                        <div>
                                          <Label>Yaratilgan</Label>
                                          <p className="text-sm mt-1">{selectedOrder.created_at_formatted || formatDate(selectedOrder.created_at)}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <Label>Mijoz ma'lumotlari</Label>
                                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                          <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{selectedOrder.client.full_name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{selectedOrder.client.phone}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {selectedOrder.category === 'taxi' && selectedOrder.passengers && (
                                        <div>
                                          <Label>Yo'lovchilar soni</Label>
                                          <p className="text-sm mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            👥 {selectedOrder.passengers} kishi
                                          </p>
                                        </div>
                                      )}

                                      {selectedOrder.category === 'parcel' && (
                                        <div>
                                          <Label>Pochta ma'lumotlari</Label>
                                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                                            {selectedOrder.parcel_content && (
                                              <div className="text-sm">
                                                <strong>Mazmuni:</strong> {selectedOrder.parcel_content}
                                              </div>
                                            )}
                                            {selectedOrder.parcel_weight && (
                                              <div className="text-sm">
                                                <strong>Og'irligi:</strong> {selectedOrder.parcel_weight}
                                              </div>
                                            )}
                                            {selectedOrder.parcel_size && (
                                              <div className="text-sm">
                                                <strong>O'lchami:</strong> {selectedOrder.parcel_size}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {selectedOrder.category === 'cargo' && (
                                        <div>
                                          <Label>Yuk ma'lumotlari</Label>
                                          <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
                                            {selectedOrder.cargo_type && (
                                              <div className="text-sm">
                                                <strong>Turi:</strong> {selectedOrder.cargo_type}
                                              </div>
                                            )}
                                            {selectedOrder.cargo_weight && (
                                              <div className="text-sm">
                                                <strong>Og'irligi:</strong> {selectedOrder.cargo_weight}
                                              </div>
                                            )}
                                            {selectedOrder.cargo_vehicle_type && (
                                              <div className="text-sm">
                                                <strong>Transport turi:</strong> {selectedOrder.cargo_vehicle_type}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      <div>
                                        <Label>Tavsif</Label>
                                        <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                          {selectedOrder.description || "Tavsif yo'q"}
                                        </p>
                                      </div>

                                      {selectedOrder.status === "accepted" && selectedOrder.accepted_driver && (
                                        <div>
                                          <Label>Qabul qilgan haydovchi</Label>
                                          <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-sm font-medium">{selectedOrder.accepted_driver.full_name}</p>
                                            <p className="text-xs text-muted-foreground">{selectedOrder.accepted_driver.phone}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
