"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, CreditCard, Banknote, Eye, EyeOff } from "lucide-react"
import { apiService, PaymentCard, PaymentCardCreate, PaymentCardUpdate } from "@/lib/api"

export default function PaymentCardManagement() {
  const [cards, setCards] = useState<PaymentCard[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<PaymentCard | null>(null)
  const [formData, setFormData] = useState<PaymentCardCreate>({
    card_number: "",
    cardholder_name: "",
    bank_name: "",
    is_active: true
  })
  const { toast } = useToast()

  // Popular Uzbek banks
  const banks = [
    "NBU (Milliy Bank)",
    "NBU (National Bank)",
    "NBU (Национальный Банк)",
    "NBU (Milliy Bank)",
    "NBU (Milliy Bank)",
    "Asaka Bank",
    "Agrobank",
    "Hamkorbank",
    "Ipoteka Bank",
    "Qishloq Qurilish Bank",
    "Sanoat Qurilish Bank",
    "Turizm Bank",
    "Xalq Bank",
    "Ziraat Bank",
    "Kapital Bank",
    "Trust Bank",
    "Aloqa Bank",
    "Mikrokreditbank",
    "Turon Bank",
    "Boshqa"
  ]

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      setLoading(true)
      const data = await apiService.getPaymentCards()
      setCards(data)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Kartalarni yuklashda xatolik yuz berdi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCard = async () => {
    try {
      await apiService.createPaymentCard(formData)
      toast({
        title: "Muvaffaqiyatli",
        description: "Karta qo'shildi"
      })
      setIsAddDialogOpen(false)
      setFormData({
        card_number: "",
        cardholder_name: "",
        bank_name: "",
        is_active: true
      })
      fetchCards()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Karta qo'shishda xatolik yuz berdi",
        variant: "destructive"
      })
    }
  }

  const handleEditCard = async () => {
    if (!editingCard) return

    try {
      const updateData: PaymentCardUpdate = {
        card_number: formData.card_number,
        cardholder_name: formData.cardholder_name,
        bank_name: formData.bank_name,
        is_active: formData.is_active
      }

      await apiService.updatePaymentCard(editingCard.id, updateData)
      toast({
        title: "Muvaffaqiyatli",
        description: "Karta yangilandi"
      })
      setIsEditDialogOpen(false)
      setEditingCard(null)
      setFormData({
        card_number: "",
        cardholder_name: "",
        bank_name: "",
        is_active: true
      })
      fetchCards()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Kartani yangilashda xatolik yuz berdi",
        variant: "destructive"
      })
    }
  }

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("Bu kartani o'chirishni xohlaysizmi?")) return

    try {
      await apiService.deletePaymentCard(cardId)
      toast({
        title: "Muvaffaqiyatli",
        description: "Karta o'chirildi"
      })
      fetchCards()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Kartani o'chirishda xatolik yuz berdi",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (card: PaymentCard) => {
    setEditingCard(card)
    setFormData({
      card_number: card.card_number,
      cardholder_name: card.cardholder_name,
      bank_name: card.bank_name,
      is_active: card.is_active
    })
    setIsEditDialogOpen(true)
  }

  const formatCardNumber = (number: string) => {
    // Format: **** **** **** 1234
    const cleaned = number.replace(/\s/g, "")
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/)
    if (match) {
      const parts = match.slice(1).filter(Boolean)
      return parts.map(part => part.padEnd(4, "*")).join(" ")
    }
    return number
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>To'lov kartalari</CardTitle>
          <CardDescription>Kartalarni boshqarish</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Yuklanmoqda...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                To'lov kartalari
              </CardTitle>
              <CardDescription>
                Ball sotib olish uchun to'lov kartalarini boshqarish
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Karta qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yangi karta qo'shish</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card_number">Karta raqami</Label>
                    <Input
                      id="card_number"
                      value={formData.card_number}
                      onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                      placeholder="8600 1234 5678 9012"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardholder_name">Karta egasining ismi</Label>
                    <Input
                      id="cardholder_name"
                      value={formData.cardholder_name}
                      onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value })}
                      placeholder="JOHN DOE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_name">Bank nomi</Label>
                    <Select value={formData.bank_name} onValueChange={(value) => setFormData({ ...formData, bank_name: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bankni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Faol</Label>
                  </div>
                  <Button onClick={handleAddCard} className="w-full">
                    Karta qo'shish
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Banknote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Hali hech qanday karta qo'shilmagan</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatCardNumber(card.card_number)}</span>
                        <Badge variant={card.is_active ? "default" : "secondary"}>
                          {card.is_active ? "Faol" : "Deaktiv"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {card.cardholder_name} • {card.bank_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(card)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kartani tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_card_number">Karta raqami</Label>
              <Input
                id="edit_card_number"
                value={formData.card_number}
                onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                placeholder="8600 1234 5678 9012"
              />
            </div>
            <div>
              <Label htmlFor="edit_cardholder_name">Karta egasining ismi</Label>
              <Input
                id="edit_cardholder_name"
                value={formData.cardholder_name}
                onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value })}
                placeholder="JOHN DOE"
              />
            </div>
            <div>
              <Label htmlFor="edit_bank_name">Bank nomi</Label>
              <Select value={formData.bank_name} onValueChange={(value) => setFormData({ ...formData, bank_name: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Bankni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit_is_active">Faol</Label>
            </div>
            <Button onClick={handleEditCard} className="w-full">
              Kartani yangilash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 