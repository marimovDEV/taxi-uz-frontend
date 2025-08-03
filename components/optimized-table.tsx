"use client"

import type React from "react"
import { memo, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OptimizedTableProps<T> {
  data: T[]
  columns: Array<{
    key: string
    header: string
    render?: (item: T) => React.ReactNode
  }>
  renderMobileCard: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
  pageSize?: number
}

function OptimizedTableComponent<T>({
  data,
  columns,
  renderMobileCard,
  keyExtractor,
  pageSize = 50,
}: OptimizedTableProps<T>) {
  const paginatedData = useMemo(() => {
    return data.slice(0, pageSize)
  }, [data, pageSize])

  const mobileCards = useMemo(() => {
    return paginatedData.map((item, index) => <div key={keyExtractor(item)}>{renderMobileCard(item, index)}</div>)
  }, [paginatedData, renderMobileCard, keyExtractor])

  const tableRows = useMemo(() => {
    return paginatedData.map((item) => (
      <TableRow key={keyExtractor(item)}>
        {columns.map((column) => (
          <TableCell key={column.key}>{column.render ? column.render(item) : (item as any)[column.key]}</TableCell>
        ))}
      </TableRow>
    ))
  }, [paginatedData, columns, keyExtractor])

  return (
    <>
      {/* Mobile Cards */}
      <div className="space-y-3 sm:hidden">{mobileCards}</div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </div>
    </>
  )
}

export const OptimizedTable = memo(OptimizedTableComponent) as typeof OptimizedTableComponent
