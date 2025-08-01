"use client"

import { useState, useEffect, useMemo } from "react"

export function useDebouncedSearch<T>(data: T[], searchTerm: string, searchFields: (keyof T)[], delay = 300) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchTerm, delay])

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return data

    const searchLower = debouncedSearchTerm.toLowerCase()
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(searchLower)
      }),
    )
  }, [data, debouncedSearchTerm, searchFields])

  return filteredData
}
