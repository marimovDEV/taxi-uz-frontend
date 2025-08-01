'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { get_text } from '@/lib/i18n'

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking'
  timestamp: string
  baseUrl: string
  error?: string
}

export default function ApiDebugger() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'checking',
    timestamp: new Date().toISOString(),
    baseUrl: ''
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const result = await apiService.healthCheck()
      setHealthStatus({
        status: result.status as 'healthy' | 'unhealthy',
        timestamp: result.timestamp,
        baseUrl: result.baseUrl
      })
    } catch (error: any) {
      setHealthStatus({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        baseUrl: 'Unknown',
        error: error.message
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'unhealthy':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅ Server bilan bog\'lanish muvaffaqiyatli'
      case 'unhealthy':
        return '❌ Server bilan bog\'lanishda muammo'
      default:
        return '⏳ Tekshirilmoqda...'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 API Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Holat:</span>
          <Badge className={getStatusColor(healthStatus.status)}>
            {getStatusText(healthStatus.status)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">API URL:</span>
            <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
              {healthStatus.baseUrl || 'Loading...'}
            </div>
          </div>

          <div className="text-sm">
            <span className="font-medium">Vaqt:</span>
            <div className="mt-1 text-gray-600">
              {new Date(healthStatus.timestamp).toLocaleString()}
            </div>
          </div>

          {healthStatus.error && (
            <Alert className="mt-4">
              <AlertDescription className="text-xs">
                <strong>Xatolik:</strong> {healthStatus.error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Button 
          onClick={checkHealth} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? '🔄 Tekshirilmoqda...' : '🔄 Qayta tekshirish'}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 Maslahatlar:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Django server ishlayotganini tekshiring</li>
            <li>Environment variable sozlamalarini tekshiring</li>
            <li>CORS sozlamalarini tekshiring</li>
            <li>Firewall sozlamalarini tekshiring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 