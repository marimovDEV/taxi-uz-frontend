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
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          To'lov So'rovlari
        </CardTitle>
        <CardDescription>
          Haydovchilar tomonidan yuborilgan to'lov so'rovlarini boshqaring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Hozircha to'lov so'rovlari yo'q
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{payment.driver_name}</h3>
                    <p className="text-sm text-muted-foreground">{payment.driver_phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(payment.status)}
                    <span className="text-lg font-bold">{payment.amount} ball</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Yuborilgan: {formatDate(payment.created_at)}</span>
                  <span>ID: #{payment.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Screenshot ko'rish
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>To'lov screenshot</DialogTitle>
                        <DialogDescription>
                          {payment.driver_name} tomonidan yuborilgan to'lov tasdiqi
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg p-4 text-center">
                          {payment.screenshot ? (
                            <img
                              src={payment.screenshot}
                              alt="Payment screenshot"
                              className="max-w-full h-auto rounded"
                            />
                          ) : (
                            <p className="text-muted-foreground">Screenshot mavjud emas</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p><strong>Haydovchi:</strong> {payment.driver_name}</p>
                          <p><strong>Telefon:</strong> {payment.driver_phone}</p>
                          <p><strong>Miqdori:</strong> {payment.amount} ball</p>
                          <p><strong>Sana:</strong> {formatDate(payment.created_at)}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {payment.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            disabled={processing}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tasdiqlash
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>To'lovni tasdiqlash</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{payment.driver_name}" tomonidan yuborilgan {payment.amount} ball to'lovini tasdiqlashni xohlaysizmi?
                              Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleUpdateStatus(payment.id, 'approved')}
                              className="bg-green-500 hover:bg-green-600"
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
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rad etish
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>To'lovni rad etish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{payment.driver_name}" tomonidan yuborilgan {payment.amount} ball to'lovini rad etishni xohlaysizmi?
                              Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleUpdateStatus(payment.id, 'rejected')}
                              className="bg-red-500 hover:bg-red-600"
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
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Jami: {payments.length} ta so'rov</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPayments}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Yangilash
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 