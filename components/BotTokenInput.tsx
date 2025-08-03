"use client"

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface BotTokenInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  error?: string
}

export default function BotTokenInput({
  value,
  onChange,
  placeholder = "Bot token kiriting...",
  className = "",
  disabled = false,
  label,
  error
}: BotTokenInputProps) {
  const [showToken, setShowToken] = useState(false)

  const toggleTokenVisibility = () => {
    setShowToken(!showToken)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={showToken ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-12 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error 
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          } dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        
        <button
          type="button"
          onClick={toggleTokenVisibility}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title={showToken ? "Tokenni yashirish" : "Tokenni ko'rsatish"}
        >
          {showToken ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {value && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Token uzunligi: {value.length} belgi
        </p>
      )}
    </div>
  )
} 