"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MobileTableProps {
  data: any[]
  renderCard: (item: any, index: number) => React.ReactNode
}

export function MobileTable({ data, renderCard }: MobileTableProps) {
  return <div className="space-y-3 sm:hidden">{data.map((item, index) => renderCard(item, index))}</div>
}

interface MobileCardProps {
  children: React.ReactNode
  className?: string
}

export function MobileCard({ children, className = "" }: MobileCardProps) {
  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
