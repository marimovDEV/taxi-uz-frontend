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
    return orders.filter(order => order.category === service)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = orders.filter(order =>
    order.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.to_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.driver?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFlightTickets = flightTickets.filter(ticket =>
    ticket.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.to_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.passenger_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTrainTickets = trainTickets.filter(ticket =>
    ticket.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.to_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.passenger_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mobile-title font-bold tracking-tight">{t("orders")}</h1>
        <p className="mobile-text text-muted-foreground">
          {t("ordersDescription")}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("searchOrders")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-input"
              />
            </div>
          </div>

      {/* Service Statistics */}
      <div className="mobile-grid">
        <Card className="mobile-card">
          <CardContent className="mobile-responsive-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text font-medium text-muted-foreground">{t("totalOrders")}</p>
                <p className="mobile-title font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="mobile-responsive-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text font-medium text-muted-foreground">{t("flightTickets")}</p>
                <p className="mobile-title font-bold">{flightTickets.length}</p>
              </div>
              <Plane className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="mobile-responsive-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text font-medium text-muted-foreground">{t("trainTickets")}</p>
                <p className="mobile-title font-bold">{trainTickets.length}</p>
              </div>
              <Train className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="mobile-responsive-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text font-medium text-muted-foreground">{t("pendingOrders")}</p>
                <p className="mobile-title font-bold">{orders.filter(o => o.status === "pending").length}</p>
              </div>
              <Loader2 className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mobile-scroll">
          <TabsTrigger value="all" className="mobile-text">{t("all")}</TabsTrigger>
          <TabsTrigger value="taxi" className="mobile-text">{t("taxi")}</TabsTrigger>
          <TabsTrigger value="parcel" className="mobile-text">{t("parcel")}</TabsTrigger>
          <TabsTrigger value="cargo" className="mobile-text">{t("cargo")}</TabsTrigger>
            </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="mobile-card">
            <CardHeader className="mobile-responsive-card">
              <CardTitle className="mobile-text">{t("allOrders")}</CardTitle>
              <CardDescription className="mobile-text">{t("allOrdersDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="mobile-responsive-card">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="mobile-table">
                <Table>
                  <TableHeader>
                      <TableRow>
                        <TableHead className="mobile-text">{t("service")}</TableHead>
                        <TableHead className="mobile-text">{t("from")}</TableHead>
                        <TableHead className="mobile-text">{t("to")}</TableHead>
                        <TableHead className="mobile-text">{t("driver")}</TableHead>
                        <TableHead className="mobile-text">{t("status")}</TableHead>
                        <TableHead className="mobile-text">{t("date")}</TableHead>
                        <TableHead className="mobile-text">{t("actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const ServiceIcon = getServiceIcon(order.category)
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="mobile-text">
                              <div className="flex items-center gap-2">
                                <ServiceIcon className={`h-4 w-4 ${getServiceColor(order.category)}`} />
                                {getServiceDisplayName(order.category)}
                              </div>
                            </TableCell>
                            <TableCell className="mobile-text">{order.from_location}</TableCell>
                            <TableCell className="mobile-text">{order.to_location}</TableCell>
                            <TableCell className="mobile-text">{order.driver?.full_name || t("noDriver")}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="mobile-text">{formatDate(order.created_at)}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="touch-target">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="mobile-modal">
                                  <DialogHeader>
                                    <DialogTitle className="mobile-text">{t("orderDetails")}</DialogTitle>
                                  </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                        <Label className="mobile-text">{t("service")}</Label>
                                        <p className="mobile-text font-medium">{getServiceDisplayName(order.category)}</p>
                                          </div>
                                          <div>
                                        <Label className="mobile-text">{t("status")}</Label>
                                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                                            </div>
                                          </div>
                                          <div>
                                      <Label className="mobile-text">{t("from")}</Label>
                                      <p className="mobile-text font-medium">{order.from_location}</p>
                                          </div>
                                          <div>
                                      <Label className="mobile-text">{t("to")}</Label>
                                      <p className="mobile-text font-medium">{order.to_location}</p>
                                          </div>
                                    {order.driver && (
                                          <div>
                                        <Label className="mobile-text">{t("driver")}</Label>
                                        <p className="mobile-text font-medium">{order.driver.full_name}</p>
                                      </div>
                                    )}
                                          <div>
                                      <Label className="mobile-text">{t("createdAt")}</Label>
                                      <p className="mobile-text font-medium">{formatDate(order.created_at)}</p>
                                            </div>
                                          </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                                              </div>
                                            )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual service tabs */}
        {["taxi", "parcel", "cargo"].map((service) => (
          <TabsContent key={service} value={service} className="space-y-4">
            <Card className="mobile-card">
              <CardHeader className="mobile-responsive-card">
                <CardTitle className="mobile-text">{getServiceDisplayName(service as any)}</CardTitle>
                <CardDescription className="mobile-text">
                  {t(`${service}OrdersDescription`)}
                </CardDescription>
              </CardHeader>
              <CardContent className="mobile-responsive-card">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                                        </div>
                ) : (
                  <div className="mobile-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="mobile-text">{t("from")}</TableHead>
                          <TableHead className="mobile-text">{t("to")}</TableHead>
                          <TableHead className="mobile-text">{t("driver")}</TableHead>
                          <TableHead className="mobile-text">{t("status")}</TableHead>
                          <TableHead className="mobile-text">{t("date")}</TableHead>
                          <TableHead className="mobile-text">{t("actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterOrdersByService(service).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="mobile-text">{order.from_location}</TableCell>
                            <TableCell className="mobile-text">{order.to_location}</TableCell>
                            <TableCell className="mobile-text">{order.driver?.full_name || t("noDriver")}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="mobile-text">{formatDate(order.created_at)}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="touch-target">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="mobile-modal">
                                  <DialogHeader>
                                    <DialogTitle className="mobile-text">{t("orderDetails")}</DialogTitle>
                                  </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <Label className="mobile-text">{t("service")}</Label>
                                        <p className="mobile-text font-medium">{getServiceDisplayName(order.category)}</p>
                                      </div>
                                      <div>
                                        <Label className="mobile-text">{t("status")}</Label>
                                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                                      </div>
                                        </div>
                                        <div>
                                      <Label className="mobile-text">{t("from")}</Label>
                                      <p className="mobile-text font-medium">{order.from_location}</p>
                                        </div>
                                        <div>
                                      <Label className="mobile-text">{t("to")}</Label>
                                      <p className="mobile-text font-medium">{order.to_location}</p>
                                              </div>
                                    {order.driver && (
                                      <div>
                                        <Label className="mobile-text">{t("driver")}</Label>
                                        <p className="mobile-text font-medium">{order.driver.full_name}</p>
                                      </div>
                                    )}
                                        <div>
                                      <Label className="mobile-text">{t("createdAt")}</Label>
                                      <p className="mobile-text font-medium">{formatDate(order.created_at)}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
                )}
              </CardContent>
            </Card>
            </TabsContent>
        ))}
          </Tabs>

      {/* Flight Tickets */}
      <Card className="mobile-card">
        <CardHeader className="mobile-responsive-card">
          <CardTitle className="mobile-text">{t("flightTickets")}</CardTitle>
          <CardDescription className="mobile-text">{t("flightTicketsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="mobile-responsive-card">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="mobile-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="mobile-text">{t("passenger")}</TableHead>
                    <TableHead className="mobile-text">{t("from")}</TableHead>
                    <TableHead className="mobile-text">{t("to")}</TableHead>
                    <TableHead className="mobile-text">{t("date")}</TableHead>
                    <TableHead className="mobile-text">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlightTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="mobile-text">{ticket.passenger_name}</TableCell>
                      <TableCell className="mobile-text">{ticket.from_location}</TableCell>
                      <TableCell className="mobile-text">{ticket.to_location}</TableCell>
                      <TableCell className="mobile-text">{formatDate(ticket.departure_date)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="touch-target">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="mobile-modal">
                            <DialogHeader>
                              <DialogTitle className="mobile-text">{t("flightTicketDetails")}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="mobile-text">{t("passenger")}</Label>
                                <p className="mobile-text font-medium">{ticket.passenger_name}</p>
                              </div>
                              <div>
                                <Label className="mobile-text">{t("from")}</Label>
                                <p className="mobile-text font-medium">{ticket.from_location}</p>
                              </div>
                              <div>
                                <Label className="mobile-text">{t("to")}</Label>
                                <p className="mobile-text font-medium">{ticket.to_location}</p>
                              </div>
                              <div>
                                <Label className="mobile-text">{t("departureDate")}</Label>
                                <p className="mobile-text font-medium">{formatDate(ticket.departure_date)}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Train Tickets */}
      <Card className="mobile-card">
        <CardHeader className="mobile-responsive-card">
          <CardTitle className="mobile-text">{t("trainTickets")}</CardTitle>
          <CardDescription className="mobile-text">{t("trainTicketsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="mobile-responsive-card">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="mobile-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="mobile-text">{t("passenger")}</TableHead>
                    <TableHead className="mobile-text">{t("from")}</TableHead>
                    <TableHead className="mobile-text">{t("to")}</TableHead>
                    <TableHead className="mobile-text">{t("date")}</TableHead>
                    <TableHead className="mobile-text">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="mobile-text">{ticket.passenger_name}</TableCell>
                      <TableCell className="mobile-text">{ticket.from_location}</TableCell>
                      <TableCell className="mobile-text">{ticket.to_location}</TableCell>
                      <TableCell className="mobile-text">{formatDate(ticket.departure_date)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="touch-target">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="mobile-modal">
                            <DialogHeader>
                              <DialogTitle className="mobile-text">{t("trainTicketDetails")}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="mobile-text">{t("passenger")}</Label>
                                <p className="mobile-text font-medium">{ticket.passenger_name}</p>
                              </div>
                              <div>
                                <Label className="mobile-text">{t("from")}</Label>
                                <p className="mobile-text font-medium">{ticket.from_location}</p>
                              </div>
                              <div>
                                <Label className="mobile-text">{t("to")}</Label>
                                <p className="mobile-text font-medium">{ticket.to_location}</p>
                              </div>
                              <div>
                                <Label className="mobile-text">{t("departureDate")}</Label>
                                <p className="mobile-text font-medium">{formatDate(ticket.departure_date)}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
