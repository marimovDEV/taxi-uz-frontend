"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, ImageIcon } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Image } from "@/components/ui/image"

interface LogoUploadProps {
  currentLogo: string | null
  onLogoChange: (logo: string | null) => void
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: t("error"),
        description: "Faqat PNG, JPG va SVG formatlar qo'llab-quvvatlanadi",
        variant: "destructive",
      })
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t("error"),
        description: "Fayl hajmi 2MB dan oshmasligi kerak",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onLogoChange(result)
      setIsUploading(false)
      toast({
        title: t("logoUploaded"),
        description: "Logo muvaffaqiyatli yuklandi",
      })
    }
    reader.onerror = () => {
      setIsUploading(false)
      toast({
        title: t("error"),
        description: "Logo yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    onLogoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast({
      title: t("logoRemoved"),
      description: "Logo muvaffaqiyatli o'chirildi",
    })
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm">{t("logo")}</Label>

      {/* Logo Preview */}
      {currentLogo && (
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <Image
              src={currentLogo}
              alt="Logo preview"
              className="max-w-full max-h-full rounded"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveLogo}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {!currentLogo && (
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 text-center px-2">{t("logoPreview")}</span>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 text-sm"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Yuklanmoqda..." : t("uploadLogo")}
        </Button>

        {currentLogo && (
          <Button variant="destructive" onClick={handleRemoveLogo} className="text-sm">
            {t("removeLogo")}
          </Button>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>{t("supportedFormats")}</p>
        <p>{t("maxFileSize")}</p>
      </div>
    </div>
  )
}
