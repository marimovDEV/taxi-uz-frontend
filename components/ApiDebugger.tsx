'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiService } from '@/lib/api'
import { logApiError, getErrorMessage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function ApiDebugger() {
  const [isLoading, setIsLoading] = useState(false)
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const { toast } = useToast()

  const runHealthCheck = async () => {
    setIsLoading(true)
    try {
      const result = await apiService.healthCheck()
      setHealthStatus(result)
      
      if (result.status === 'healthy') {
        toast({
          title: "✅ API is healthy",
          description: `Connected to ${result.baseUrl}`,
        })
      } else {
        toast({
          title: "❌ API is unhealthy",
          description: "Check server connection",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      logApiError(error, 'Health Check')
      toast({
        title: "❌ Health check failed",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testBotSettings = async () => {
    setIsLoading(true)
    try {
      const result = await apiService.getBotSettings()
      setTestResults(prev => [...prev, {
        test: 'Bot Settings',
        status: 'success',
        data: result,
        timestamp: new Date().toISOString()
      }])
      toast({
        title: "✅ Bot settings test passed",
        description: "Successfully retrieved bot settings",
      })
    } catch (error: any) {
      logApiError(error, 'Bot Settings Test')
      setTestResults(prev => [...prev, {
        test: 'Bot Settings',
        status: 'error',
        error: getErrorMessage(error),
        timestamp: new Date().toISOString()
      }])
      toast({
        title: "❌ Bot settings test failed",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
    setHealthStatus(null)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 API Debugger
        </CardTitle>
        <CardDescription>
          Test API connectivity and endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runHealthCheck} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : '🏥 Health Check'}
          </Button>
          <Button 
            onClick={testBotSettings} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : '🤖 Test Bot Settings'}
          </Button>
          <Button 
            onClick={clearResults} 
            variant="outline"
            size="sm"
          >
            🗑️ Clear
          </Button>
        </div>

        {healthStatus && (
          <div className="space-y-2">
            <h4 className="font-medium">Health Status:</h4>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
                  {healthStatus.status}
                </Badge>
              </div>
              <div>Base URL: {healthStatus.baseUrl}</div>
              <div>Timestamp: {healthStatus.timestamp}</div>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Results:</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded p-2 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{result.test}:</span>
                    <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.timestamp}
                  </div>
                  {result.error && (
                    <div className="text-red-600 mt-1">{result.error}</div>
                  )}
                  {result.data && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs">View Data</summary>
                      <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 