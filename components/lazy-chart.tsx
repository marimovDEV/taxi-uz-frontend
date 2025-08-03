"use client"

import { memo } from "react"
import { ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Area, Bar } from "recharts"

// Mock data
const growthData = [
  { date: "2024-01-01", users: 120, orders: 45, revenue: 450000 },
  { date: "2024-01-02", users: 135, orders: 52, revenue: 520000 },
  { date: "2024-01-03", users: 142, orders: 48, revenue: 480000 },
  { date: "2024-01-04", users: 158, orders: 67, revenue: 670000 },
  { date: "2024-01-05", users: 167, orders: 71, revenue: 710000 },
  { date: "2024-01-06", users: 189, orders: 83, revenue: 830000 },
  { date: "2024-01-07", users: 203, orders: 91, revenue: 910000 },
]

const tradingData = [
  { time: "09:00", open: 45, high: 52, low: 43, close: 50, volume: 234 },
  { time: "10:00", open: 50, high: 58, low: 48, close: 55, volume: 345 },
  { time: "11:00", open: 55, high: 62, low: 53, close: 59, volume: 456 },
  { time: "12:00", open: 59, high: 65, low: 57, close: 63, volume: 567 },
  { time: "13:00", open: 63, high: 68, low: 61, close: 66, volume: 678 },
  { time: "14:00", open: 66, high: 72, low: 64, close: 70, volume: 789 },
]

interface LazyChartProps {
  type: "growth" | "trading"
  height: number
}

const LazyChart = memo(({ type, height }: LazyChartProps) => {
  if (type === "growth") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value, name) => [
              name === "revenue" ? `${Number(value).toLocaleString()} so'm` : value,
              name === "users" ? "Foydalanuvchilar" : name === "orders" ? "Buyurtmalar" : "Daromad",
            ]}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="users"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Bar yAxisId="left" dataKey="orders" fill="#10b981" />
          <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  if (type === "trading") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={tradingData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar yAxisId="right" dataKey="volume" fill="#e5e7eb" opacity={0.7} />
          <Line yAxisId="left" type="monotone" dataKey="open" stroke="#10b981" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#f59e0b" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  return null
})

LazyChart.displayName = "LazyChart"

export default LazyChart
