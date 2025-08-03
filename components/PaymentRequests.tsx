"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { apiService, PaymentData } from "@/lib/api"
import { CreditCard, CheckCircle, XCircle, Eye, RefreshCw, Download } from "lucide-react"

export default function PaymentRequests() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const data = await apiService.getPayments()
      setPayments(data)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "To'lov so'rovlari yuklanmadi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (paymentId: number, status: 'approved' | 'rejected') => {
    setProcessing(true)
    try {
      await apiService.updatePaymentStatus(paymentId, status)
      toast({
        title: "Muvaffaqiyatli",
        description: `To'lov ${status === 'approved' ? 'tasdiqlandi' : 'rad etildi'}`
      })
      fetchPayments() // Refresh the list
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "To'lov holati yangilanmadi",
        variant: "destructive"
      })
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Kutmoqda</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Tasdiqlangan</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rad etilgan</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card className="mobile-card">
      <CardHeader className="mobile-responsive-card">
        <CardTitle className="flex items-center gap-2 mobile-text">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          To'lov So'rovlari
        </CardTitle>
        <CardDescription className="mobile-text">
          Haydovchilar tomonidan yuborilgan to'lov so'rovlarini boshqaring
        </CardDescription>
      </CardHeader>
      <CardContent className="mobile-responsive-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="mobile-text font-medium">Jami so'rovlar: {payments.length}</p>
            <p className="mobile-text text-muted-foreground">
              Kutmoqda: {payments.filter(p => p.status === 'pending').length} | 
              Tasdiqlangan: {payments.filter(p => p.status === 'approved').length} | 
              Rad etilgan: {payments.filter(p => p.status === 'rejected').length}
            </p>
          </div>
          <Button 
            onClick={fetchPayments} 
            disabled={loading}
            variant="outline"
            className="mobile-button"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yangilash
          </Button>
        </div>

        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="mobile-text text-muted-foreground">To'lov so'rovlari mavjud emas</p>
            </div>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id} className="mobile-card">
                <CardContent className="mobile-responsive-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="mobile-text font-medium truncate">
                          {payment.driver.full_name}
                        </h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mobile-text text-muted-foreground">
                        <div>Summa: <span className="font-medium text-foreground">{payment.amount.toLocaleString()} so'm</span></div>
                        <div>Telefon: {payment.driver.phone}</div>
                        <div>Sana: {formatDate(payment.created_at)}</div>
                      </div>
                      {payment.comment && (
                        <p className="mobile-text text-muted-foreground mt-2">
                          Izoh: {payment.comment}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="touch-target">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="mobile-modal">
                          <DialogHeader>
                            <DialogTitle className="mobile-text">To'lov ma'lumotlari</DialogTitle>
                            <DialogDescription className="mobile-text">
                              To'lov so'rovining batafsil ma'lumotlari
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="mobile-text font-medium">Haydovchi</p>
                                <p className="mobile-text">{payment.driver.full_name}</p>
                              </div>
                              <div>
                                <p className="mobile-text font-medium">Telefon</p>
                                <p className="mobile-text">{payment.driver.phone}</p>
                              </div>
                              <div>
                                <p className="mobile-text font-medium">Summa</p>
                                <p className="mobile-text font-bold">{payment.amount.toLocaleString()} so'm</p>
                              </div>
                              <div>
                                <p className="mobile-text font-medium">Holat</p>
                                <div className="mt-1">{getStatusBadge(payment.status)}</div>
                              </div>
                            </div>
                            <div>
                              <p className="mobile-text font-medium">Sana</p>
                              <p className="mobile-text">{formatDate(payment.created_at)}</p>
                            </div>
                            {payment.comment && (
                              <div>
                                <p className="mobile-text font-medium">Izoh</p>
                                <p className="mobile-text">{payment.comment}</p>
                              </div>
                            )}
                            {payment.updated_at && payment.updated_at !== payment.created_at && (
                              <div>
                                <p className="mobile-text font-medium">Yangilangan</p>
                                <p className="mobile-text">{formatDate(payment.updated_at)}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {payment.status === 'pending' && (
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="default" 
                                size="sm"
                                disabled={processing}
                                className="mobile-button"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Tasdiqlash
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="mobile-modal">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="mobile-text">To'lovni tasdiqlash</AlertDialogTitle>
                                <AlertDialogDescription className="mobile-text">
                                  {payment.driver.full_name} tomonidan {payment.amount.toLocaleString()} so'm miqdoridagi to'lov so'rovini tasdiqlashni xohlaysizmi?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="mobile-button">Bekor qilish</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleUpdateStatus(payment.id, 'approved')}
                                  className="mobile-button"
                                >
                                  Tasdiqlash
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={processing}
                                className="mobile-button"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rad etish
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="mobile-modal">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="mobile-text">To'lovni rad etish</AlertDialogTitle>
                                <AlertDialogDescription className="mobile-text">
                                  {payment.driver.full_name} tomonidan {payment.amount.toLocaleString()} so'm miqdoridagi to'lov so'rovini rad etishni xohlaysizmi?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="mobile-button">Bekor qilish</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleUpdateStatus(payment.id, 'rejected')}
                                  className="mobile-button"
                                >
                                  Rad etish
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 