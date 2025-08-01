"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type React from "react"

interface BrandingSettings {
  organizationName: string
  logo: string | null
}

interface BrandingContextType {
  branding: BrandingSettings
  updateBranding: (settings: Partial<BrandingSettings>) => void
}

const defaultBranding: BrandingSettings = {
  organizationName: "Yol yolakay Admin",
  logo: null,
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined)

export function useBranding() {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider")
  }
  return context
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding)

  useEffect(() => {
    const savedBranding = localStorage.getItem("branding_settings")
    if (savedBranding) {
      try {
        const parsed = JSON.parse(savedBranding)
        setBranding({ ...defaultBranding, ...parsed })
      } catch (error) {
        console.error("Error parsing branding settings:", error)
      }
    }
  }, [])

  const updateBranding = (settings: Partial<BrandingSettings>) => {
    const newBranding = { ...branding, ...settings }
    setBranding(newBranding)
    localStorage.setItem("branding_settings", JSON.stringify(newBranding))
  }

  return <BrandingContext.Provider value={{ branding, updateBranding }}>{children}</BrandingContext.Provider>
} 