"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { apiService, CountryData, RegionData, CityData } from "@/lib/api"
import { Globe, MapPin, Building, Plus, Edit, Trash2, RefreshCw, Eye } from "lucide-react"

export default function LocationManagement() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = useState<CountryData[]>([])
  const [regions, setRegions] = useState<RegionData[]>([])
  const [cities, setCities] = useState<CityData[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")

  // Form states for new items
  const [newCountry, setNewCountry] = useState({
    code: '',
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_tj: '',
    name_kk: ''
  })
  const [newRegion, setNewRegion] = useState({
    country: '',
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_tj: '',
    name_kk: ''
  })
  const [newCity, setNewCity] = useState({
    region: '',
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_tj: '',
    name_kk: ''
  })

  // Edit states
  const [editingCountry, setEditingCountry] = useState<CountryData | null>(null)
  const [editingRegion, setEditingRegion] = useState<RegionData | null>(null)
  const [editingCity, setEditingCity] = useState<CityData | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      fetchRegions(parseInt(selectedCountry))
    }
  }, [selectedCountry])

  useEffect(() => {
    if (selectedRegion) {
      fetchCities(parseInt(selectedRegion))
    }
  }, [selectedRegion])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [countriesData, regionsData, citiesData] = await Promise.all([
        apiService.getCountries(),
        apiService.getRegions(),
        apiService.getCities()
      ])
      setCountries(countriesData)
      setRegions(regionsData)
      setCities(citiesData)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlar yuklanmadi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRegions = async (countryId: number) => {
    try {
      const data = await apiService.getRegions(countryId)
      setRegions(data)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Viloyatlar yuklanmadi",
        variant: "destructive"
      })
    }
  }

  const fetchCities = async (regionId: number) => {
    try {
      const data = await apiService.getCities(regionId)
      setCities(data)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Shaharlar yuklanmadi",
        variant: "destructive"
      })
    }
  }

  const handleAddCountry = async () => {
    if (!newCountry.code || !newCountry.name_uz) {
      toast({
        title: "Xatolik",
        description: "Kod va o'zbekcha nom to'ldirilishi kerak",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      await apiService.addCountry(newCountry)
      toast({
        title: "Muvaffaqiyatli",
        description: "Davlat qo'shildi"
      })
      setNewCountry({ code: '', name_uz: '', name_ru: '', name_en: '', name_tj: '', name_kk: '' })
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Davlat qo'shilmadi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddRegion = async () => {
    if (!newRegion.country || !newRegion.name_uz) {
      toast({
        title: "Xatolik",
        description: "Davlat va o'zbekcha nom to'ldirilishi kerak",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      await apiService.addRegion(newRegion)
      toast({
        title: "Muvaffaqiyatli",
        description: "Viloyat qo'shildi"
      })
      setNewRegion({ country: '', name_uz: '', name_ru: '', name_en: '', name_tj: '', name_kk: '' })
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Viloyat qo'shilmadi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddCity = async () => {
    if (!newCity.region || !newCity.name_uz) {
      toast({
        title: "Xatolik",
        description: "Viloyat va o'zbekcha nom to'ldirilishi kerak",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      await apiService.addCity(newCity)
      toast({
        title: "Muvaffaqiyatli",
        description: "Shahar qo'shildi"
      })
      setNewCity({ region: '', name_uz: '', name_ru: '', name_en: '', name_tj: '', name_kk: '' })
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Shahar qo'shilmadi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCountry = async () => {
    if (!editingCountry) return

    setSaving(true)
    try {
      await apiService.updateCountry(editingCountry.id, {
        code: editingCountry.code,
        name_uz: editingCountry.name_uz,
        name_ru: editingCountry.name_ru,
        name_en: editingCountry.name_en,
        name_tj: editingCountry.name_tj,
        name_kk: editingCountry.name_kk
      })
      toast({
        title: "Muvaffaqiyatli",
        description: "Davlat yangilandi"
      })
      setEditingCountry(null)
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Davlat yangilanmadi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateRegion = async () => {
    if (!editingRegion) return

    setSaving(true)
    try {
      await apiService.updateRegion(editingRegion.id, {
        country: editingRegion.country,
        name_uz: editingRegion.name_uz,
        name_ru: editingRegion.name_ru,
        name_en: editingRegion.name_en,
        name_tj: editingRegion.name_tj,
        name_kk: editingRegion.name_kk
      })
      toast({
        title: "Muvaffaqiyatli",
        description: "Viloyat yangilandi"
      })
      setEditingRegion(null)
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Viloyat yangilanmadi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCity = async () => {
    if (!editingCity) return

    setSaving(true)
    try {
      await apiService.updateCity(editingCity.id, {
        region: editingCity.region,
        name_uz: editingCity.name_uz,
        name_ru: editingCity.name_ru,
        name_en: editingCity.name_en,
        name_tj: editingCity.name_tj,
        name_kk: editingCity.name_kk
      })
      toast({
        title: "Muvaffaqiyatli",
        description: "Shahar yangilandi"
      })
      setEditingCity(null)
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Shahar yangilanmadi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCountry = async (countryId: number) => {
    try {
      await apiService.deleteCountry(countryId)
      toast({
        title: "Muvaffaqiyatli",
        description: "Davlat o'chirildi"
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Davlat o'chirilmadi",
        variant: "destructive"
      })
    }
  }

  const handleDeleteRegion = async (regionId: number) => {
    try {
      await apiService.deleteRegion(regionId)
      toast({
        title: "Muvaffaqiyatli",
        description: "Viloyat o'chirildi"
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Viloyat o'chirilmadi",
        variant: "destructive"
      })
    }
  }

  const handleDeleteCity = async (cityId: number) => {
    try {
      await apiService.deleteCity(cityId)
      toast({
        title: "Muvaffaqiyatli",
        description: "Shahar o'chirildi"
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Shahar o'chirilmadi",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Mavjud ma'lumotlar
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yangi qo'shish
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-6">
          {/* Countries List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Davlatlar
              </CardTitle>
              <CardDescription>
                Mavjud davlatlar ro'yxati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countries.map((country) => (
                  <div key={country.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{country.name_uz}</div>
                      <div className="text-sm text-muted-foreground">
                        {country.code} • {country.name_ru} • {country.name_en}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCountry(country)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Davlatni tahrirlash</DialogTitle>
                            <DialogDescription>
                              Davlat ma'lumotlarini o'zgartiring
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Kod</Label>
                              <Input
                                value={editingCountry?.code || ''}
                                onChange={(e) => setEditingCountry(prev => prev ? {...prev, code: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>O'zbekcha nom</Label>
                              <Input
                                value={editingCountry?.name_uz || ''}
                                onChange={(e) => setEditingCountry(prev => prev ? {...prev, name_uz: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Ruscha nom</Label>
                              <Input
                                value={editingCountry?.name_ru || ''}
                                onChange={(e) => setEditingCountry(prev => prev ? {...prev, name_ru: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Inglizcha nom</Label>
                              <Input
                                value={editingCountry?.name_en || ''}
                                onChange={(e) => setEditingCountry(prev => prev ? {...prev, name_en: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Tojikcha nom</Label>
                              <Input
                                value={editingCountry?.name_tj || ''}
                                onChange={(e) => setEditingCountry(prev => prev ? {...prev, name_tj: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Qozoqcha nom</Label>
                              <Input
                                value={editingCountry?.name_kk || ''}
                                onChange={(e) => setEditingCountry(prev => prev ? {...prev, name_kk: e.target.value} : null)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleUpdateCountry} disabled={saving}>
                                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Saqlash'}
                              </Button>
                              <Button variant="outline" onClick={() => setEditingCountry(null)}>
                                Bekor qilish
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Davlatni o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{country.name_uz}" davlatini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCountry(country.id)}>
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Viloyatlar
              </CardTitle>
              <CardDescription>
                Mavjud viloyatlar ro'yxati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regions.map((region) => (
                  <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{region.name_uz}</div>
                      <div className="text-sm text-muted-foreground">
                        {region.name_ru} • {region.name_en}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRegion(region)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Viloyatni tahrirlash</DialogTitle>
                            <DialogDescription>
                              Viloyat ma'lumotlarini o'zgartiring
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>O'zbekcha nom</Label>
                              <Input
                                value={editingRegion?.name_uz || ''}
                                onChange={(e) => setEditingRegion(prev => prev ? {...prev, name_uz: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Ruscha nom</Label>
                              <Input
                                value={editingRegion?.name_ru || ''}
                                onChange={(e) => setEditingRegion(prev => prev ? {...prev, name_ru: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Inglizcha nom</Label>
                              <Input
                                value={editingRegion?.name_en || ''}
                                onChange={(e) => setEditingRegion(prev => prev ? {...prev, name_en: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Tojikcha nom</Label>
                              <Input
                                value={editingRegion?.name_tj || ''}
                                onChange={(e) => setEditingRegion(prev => prev ? {...prev, name_tj: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Qozoqcha nom</Label>
                              <Input
                                value={editingRegion?.name_kk || ''}
                                onChange={(e) => setEditingRegion(prev => prev ? {...prev, name_kk: e.target.value} : null)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleUpdateRegion} disabled={saving}>
                                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Saqlash'}
                              </Button>
                              <Button variant="outline" onClick={() => setEditingRegion(null)}>
                                Bekor qilish
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Viloyatni o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{region.name_uz}" viloyatini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteRegion(region.id)}>
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cities List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Shaharlar
              </CardTitle>
              <CardDescription>
                Mavjud shaharlar ro'yxati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cities.map((city) => (
                  <div key={city.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{city.name_uz}</div>
                      <div className="text-sm text-muted-foreground">
                        {city.name_ru} • {city.name_en}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCity(city)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Shaharni tahrirlash</DialogTitle>
                            <DialogDescription>
                              Shahar ma'lumotlarini o'zgartiring
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>O'zbekcha nom</Label>
                              <Input
                                value={editingCity?.name_uz || ''}
                                onChange={(e) => setEditingCity(prev => prev ? {...prev, name_uz: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Ruscha nom</Label>
                              <Input
                                value={editingCity?.name_ru || ''}
                                onChange={(e) => setEditingCity(prev => prev ? {...prev, name_ru: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Inglizcha nom</Label>
                              <Input
                                value={editingCity?.name_en || ''}
                                onChange={(e) => setEditingCity(prev => prev ? {...prev, name_en: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Tojikcha nom</Label>
                              <Input
                                value={editingCity?.name_tj || ''}
                                onChange={(e) => setEditingCity(prev => prev ? {...prev, name_tj: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Qozoqcha nom</Label>
                              <Input
                                value={editingCity?.name_kk || ''}
                                onChange={(e) => setEditingCity(prev => prev ? {...prev, name_kk: e.target.value} : null)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleUpdateCity} disabled={saving}>
                                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Saqlash'}
                              </Button>
                              <Button variant="outline" onClick={() => setEditingCity(null)}>
                                Bekor qilish
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Shaharni o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{city.name_uz}" shahrini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCity(city.id)}>
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          {/* Add Country Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Davlat qo'shish
              </CardTitle>
              <CardDescription>
                Yangi davlat qo'shish
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country_code">Davlat kodi</Label>
                  <Input
                    id="country_code"
                    value={newCountry.code}
                    onChange={(e) => setNewCountry({...newCountry, code: e.target.value})}
                    placeholder="UZ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country_name_uz">O'zbekcha nom</Label>
                  <Input
                    id="country_name_uz"
                    value={newCountry.name_uz}
                    onChange={(e) => setNewCountry({...newCountry, name_uz: e.target.value})}
                    placeholder="O'zbekiston"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country_name_ru">Ruscha nom</Label>
                  <Input
                    id="country_name_ru"
                    value={newCountry.name_ru}
                    onChange={(e) => setNewCountry({...newCountry, name_ru: e.target.value})}
                    placeholder="Узбекистан"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country_name_en">Inglizcha nom</Label>
                  <Input
                    id="country_name_en"
                    value={newCountry.name_en}
                    onChange={(e) => setNewCountry({...newCountry, name_en: e.target.value})}
                    placeholder="Uzbekistan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country_name_tj">Tojikcha nom</Label>
                  <Input
                    id="country_name_tj"
                    value={newCountry.name_tj}
                    onChange={(e) => setNewCountry({...newCountry, name_tj: e.target.value})}
                    placeholder="Ӯзбекистон"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country_name_kk">Qozoqcha nom</Label>
                  <Input
                    id="country_name_kk"
                    value={newCountry.name_kk}
                    onChange={(e) => setNewCountry({...newCountry, name_kk: e.target.value})}
                    placeholder="Өзбекстан"
                  />
                </div>
              </div>
              <Button onClick={handleAddCountry} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Davlat qo'shish
              </Button>
            </CardContent>
          </Card>

          {/* Add Region Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Viloyat qo'shish
              </CardTitle>
              <CardDescription>
                Yangi viloyat qo'shish
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region_country">Davlat</Label>
                <Select value={newRegion.country} onValueChange={(value) => setNewRegion({...newRegion, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Davlatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name_uz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region_name_uz">O'zbekcha nom</Label>
                  <Input
                    id="region_name_uz"
                    value={newRegion.name_uz}
                    onChange={(e) => setNewRegion({...newRegion, name_uz: e.target.value})}
                    placeholder="Toshkent viloyati"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region_name_ru">Ruscha nom</Label>
                  <Input
                    id="region_name_ru"
                    value={newRegion.name_ru}
                    onChange={(e) => setNewRegion({...newRegion, name_ru: e.target.value})}
                    placeholder="Ташкентская область"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region_name_en">Inglizcha nom</Label>
                  <Input
                    id="region_name_en"
                    value={newRegion.name_en}
                    onChange={(e) => setNewRegion({...newRegion, name_en: e.target.value})}
                    placeholder="Tashkent Region"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region_name_tj">Tojikcha nom</Label>
                  <Input
                    id="region_name_tj"
                    value={newRegion.name_tj}
                    onChange={(e) => setNewRegion({...newRegion, name_tj: e.target.value})}
                    placeholder="Вилояти Тошкент"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region_name_kk">Qozoqcha nom</Label>
                  <Input
                    id="region_name_kk"
                    value={newRegion.name_kk}
                    onChange={(e) => setNewRegion({...newRegion, name_kk: e.target.value})}
                    placeholder="Тошкент облысы"
                  />
                </div>
              </div>
              <Button onClick={handleAddRegion} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Viloyat qo'shish
              </Button>
            </CardContent>
          </Card>

          {/* Add City Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Shahar qo'shish
              </CardTitle>
              <CardDescription>
                Yangi shahar qo'shish
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city_country">Davlat</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Davlatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name_uz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_region">Viloyat</Label>
                  <Select 
                    value={newCity.region} 
                    onValueChange={(value) => setNewCity({...newCity, region: value})}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {region.name_uz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city_name_uz">O'zbekcha nom</Label>
                  <Input
                    id="city_name_uz"
                    value={newCity.name_uz}
                    onChange={(e) => setNewCity({...newCity, name_uz: e.target.value})}
                    placeholder="Toshkent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_name_ru">Ruscha nom</Label>
                  <Input
                    id="city_name_ru"
                    value={newCity.name_ru}
                    onChange={(e) => setNewCity({...newCity, name_ru: e.target.value})}
                    placeholder="Ташкент"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_name_en">Inglizcha nom</Label>
                  <Input
                    id="city_name_en"
                    value={newCity.name_en}
                    onChange={(e) => setNewCity({...newCity, name_en: e.target.value})}
                    placeholder="Tashkent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_name_tj">Tojikcha nom</Label>
                  <Input
                    id="city_name_tj"
                    value={newCity.name_tj}
                    onChange={(e) => setNewCity({...newCity, name_tj: e.target.value})}
                    placeholder="Тошкент"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_name_kk">Qozoqcha nom</Label>
                  <Input
                    id="city_name_kk"
                    value={newCity.name_kk}
                    onChange={(e) => setNewCity({...newCity, name_kk: e.target.value})}
                    placeholder="Тошкент"
                  />
                </div>
              </div>
              <Button onClick={handleAddCity} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Shahar qo'shish
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 