"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiService, BallPackage, BallPackageCreate, BallPackageUpdate } from "@/lib/api"
import { Coins, Save, RefreshCw, Plus, Trash2, Edit2, X, Check } from "lucide-react"

const emptyForm: BallPackageCreate = {
  package_name: "",
  service_type: "taxi_parcel",
  ball_count: 1,
  price: 0,
  discount_percentage: 0,
  is_active: true,
  is_popular: false,
  description: "",
  sort_order: 0,
}

export default function BallPricingSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [packages, setPackages] = useState<BallPackage[]>([])
  const [form, setForm] = useState<BallPackageCreate>(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const data = await apiService.getBallPackages()
      setPackages(data.sort((a, b) => (a.service_type > b.service_type ? 1 : -1) || a.sort_order - b.sort_order))
    } catch (error) {
      toast({ title: "Xatolik", description: "Ball paketlari yuklanmadi", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
    }))
  }

  const handleEdit = (pkg: BallPackage) => {
    setEditId(pkg.id)
    setForm({
      package_name: pkg.package_name,
      service_type: pkg.service_type,
      ball_count: pkg.ball_count,
      price: pkg.price,
      discount_percentage: pkg.discount_percentage,
      is_active: pkg.is_active,
      is_popular: pkg.is_popular,
      description: pkg.description || "",
      sort_order: pkg.sort_order || 0,
    })
    setFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Rostdan ham ushbu ball paketini o'chirmoqchimisiz?")) return
    setSaving(true)
    try {
      await apiService.deleteBallPackage(id)
      toast({ title: "O'chirildi", description: "Ball paketi o'chirildi" })
      fetchPackages()
    } catch (error) {
      toast({ title: "Xatolik", description: "O'chirishda xatolik", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await apiService.updateBallPackage(editId, form)
        toast({ title: "Yangilandi", description: "Ball paketi yangilandi" })
      } else {
        await apiService.createBallPackage(form)
        toast({ title: "Qo'shildi", description: "Yangi ball paketi qo'shildi" })
      }
      setForm(emptyForm)
      setEditId(null)
      setFormOpen(false)
      fetchPackages()
    } catch (error) {
      toast({ title: "Xatolik", description: "Saqlashda xatolik", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditId(null)
    setFormOpen(false)
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
          <Coins className="h-5 w-5" />
          Ball Narxlari (Paketlar)
        </CardTitle>
        <CardDescription>
          Ball paketlarini qo'shish, tahrirlash va o'chirish mumkin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => { setFormOpen(true); setEditId(null); setForm(emptyForm) }}>
            <Plus className="h-4 w-4 mr-2" /> Yangi paket
          </Button>
        </div>

        {formOpen && (
          <form onSubmit={handleFormSubmit} className="p-4 border rounded-lg space-y-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paket nomi</Label>
                <Input name="package_name" value={form.package_name} onChange={handleInput} required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>Xizmat turi</Label>
                <select name="service_type" value={form.service_type} onChange={handleInput} className="w-full border rounded px-2 py-2">
                  <option value="taxi_parcel">🚕 Taxi va 📦 Pochta</option>
                  <option value="cargo">🚚 Gruz</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Ball soni</Label>
                <Input name="ball_count" type="number" min={1} value={form.ball_count} onChange={handleInput} required />
              </div>
              <div className="space-y-2">
                <Label>Narxi (so'm)</Label>
                <Input name="price" type="number" min={0} value={form.price} onChange={handleInput} required />
              </div>
              <div className="space-y-2">
                <Label>Chegirma (%)</Label>
                <Input name="discount_percentage" type="number" min={0} max={100} value={form.discount_percentage} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <Label>Tartib raqami</Label>
                <Input name="sort_order" type="number" min={0} value={form.sort_order} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <Label>Tavsif</Label>
                <Input name="description" value={form.description} onChange={handleInput} maxLength={255} />
              </div>
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInput} /> Faol
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_popular" checked={form.is_popular} onChange={handleInput} /> Mashhur
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-1" /> Bekor qilish
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-1" /> : (editId ? <Check className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />)}
                {editId ? "Saqlash" : "Qo'shish"}
              </Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2">#</th>
                <th className="p-2">Nomi</th>
                <th className="p-2">Xizmat</th>
                <th className="p-2">Ball</th>
                <th className="p-2">Narxi</th>
                <th className="p-2">Chegirma</th>
                <th className="p-2">Faol</th>
                <th className="p-2">Mashhur</th>
                <th className="p-2">Tartib</th>
                <th className="p-2">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, i) => (
                <tr key={pkg.id} className={pkg.is_active ? "" : "opacity-50"}>
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-medium">{pkg.package_name}</td>
                  <td className="p-2">{pkg.service_type === 'taxi_parcel' ? '🚕 Taxi/Pochta' : '🚚 Gruz'}</td>
                  <td className="p-2">{pkg.ball_count}</td>
                  <td className="p-2">{pkg.price.toLocaleString()} so'm</td>
                  <td className="p-2">{pkg.discount_percentage ? `${pkg.discount_percentage}%` : '-'}</td>
                  <td className="p-2">{pkg.is_active ? '✅' : '❌'}</td>
                  <td className="p-2">{pkg.is_popular ? '⭐' : '-'}</td>
                  <td className="p-2">{pkg.sort_order ?? '-'}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(pkg)} title="Tahrirlash">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(pkg.id)} title="O'chirish" disabled={saving}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center p-4 text-muted-foreground">Ball paketlari topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 