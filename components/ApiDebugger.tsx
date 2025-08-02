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
  response?: any
}

interface TestResult {
  endpoint: string
  status: 'success' | 'error'
  response?: any
  error?: string
  duration: number
}

export default function ApiDebugger() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'checking',
    timestamp: new Date().toISOString(),
    baseUrl: ''
  })
  const [isChecking, setIsChecking] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const result = await apiService.healthCheck()
      setHealthStatus({
        status: result.status as 'healthy' | 'unhealthy',
        timestamp: result.timestamp,
        baseUrl: result.baseUrl,
        response: result
      })
    } catch (error: any) {
      setHealthStatus({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        baseUrl: 'Unknown',
        error: error.message,
        response: error
      })
    } finally {
      setIsChecking(false)
    }
  }

  const runTests = async () => {
    setIsTesting(true)
    const tests: TestResult[] = []
    
    const endpoints = [
      '/api/health/',
      '/api/drivers/',
      '/api/orders/',
      '/api/payments/',
      '/api/stats/general/'
    ]

    for (const endpoint of endpoints) {
      const startTime = Date.now()
      try {
        const response = await fetch(`http://46.173.29.248${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        const duration = Date.now() - startTime
        
        if (response.ok) {
          const data = await response.json()
          tests.push({
            endpoint,
            status: 'success',
            response: data,
            duration
          })
        } else {
          tests.push({
            endpoint,
            status: 'error',
            error: `HTTP ${response.status}: ${response.statusText}`,
            duration
          })
        }
      } catch (error: any) {
        const duration = Date.now() - startTime
        tests.push({
          endpoint,
          status: 'error',
          error: error.message,
          duration
        })
      }
    }
    
    setTestResults(tests)
    setIsTesting(false)
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
    <div className="space-y-6">
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

          <div className="flex gap-2">
            <Button 
              onClick={checkHealth} 
              disabled={isChecking}
              className="flex-1"
            >
              {isChecking ? '🔄 Tekshirilmoqda...' : '🔄 Qayta tekshirish'}
            </Button>
            
            <Button 
              onClick={runTests} 
              disabled={isTesting}
              variant="outline"
              className="flex-1"
            >
              {isTesting ? '🧪 Test...' : '🧪 Test qilish'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧪 API Test natijalari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{test.endpoint}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={test.status === 'success' ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {test.status === 'success' ? '✅' : '❌'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {test.duration}ms
                      </span>
                    </div>
                  </div>
                  
                  {test.error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {test.error}
                    </div>
                  )}
                  
                  {test.response && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-blue-600">
                        Response ko'rish
                      </summary>
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(test.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Maslahatlar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Django server ishlayotganini tekshiring</li>
          <li>Environment variable sozlamalarini tekshiring</li>
          <li>CORS sozlamalarini tekshiring</li>
          <li>Firewall sozlamalarini tekshiring</li>
          <li>Browser Console da xatoliklarni tekshiring</li>
        </ul>
      </div>
    </div>
  )
} 