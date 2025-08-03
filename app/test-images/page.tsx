'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestImagesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🖼️ Image Loading Test</h1>
        <p className="text-muted-foreground">Testing if images are loading correctly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Test 1: Basic placeholder.svg */}
        <Card>
          <CardHeader>
            <CardTitle>Test 1: Basic SVG</CardTitle>
            <CardDescription>/placeholder.svg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src="/placeholder.svg" 
                alt="Test SVG" 
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('✅ SVG loaded successfully')}
                onError={(e) => console.error('❌ SVG failed to load:', e)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test 2: PNG placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Test 2: PNG Image</CardTitle>
            <CardDescription>/placeholder-logo.png</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src="/placeholder-logo.png" 
                alt="Test PNG" 
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('✅ PNG loaded successfully')}
                onError={(e) => console.error('❌ PNG failed to load:', e)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test 3: JPG placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Test 3: JPG Image</CardTitle>
            <CardDescription>/placeholder-user.jpg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src="/placeholder-user.jpg" 
                alt="Test JPG" 
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('✅ JPG loaded successfully')}
                onError={(e) => console.error('❌ JPG failed to load:', e)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test 4: External image */}
        <Card>
          <CardHeader>
            <CardTitle>Test 4: External Image</CardTitle>
            <CardDescription>https://via.placeholder.com/150</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src="https://via.placeholder.com/150" 
                alt="External Test" 
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('✅ External image loaded successfully')}
                onError={(e) => console.error('❌ External image failed to load:', e)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test 5: Data URL */}
        <Card>
          <CardHeader>
            <CardTitle>Test 5: Data URL</CardTitle>
            <CardDescription>Base64 encoded image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGVzdDwvdGV4dD48L3N2Zz4=" 
                alt="Data URL Test" 
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('✅ Data URL loaded successfully')}
                onError={(e) => console.error('❌ Data URL failed to load:', e)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test 6: Missing image */}
        <Card>
          <CardHeader>
            <CardTitle>Test 6: Missing Image</CardTitle>
            <CardDescription>/non-existent-image.png</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src="/non-existent-image.png" 
                alt="Missing Image" 
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('✅ Missing image loaded (unexpected)')}
                onError={(e) => console.error('❌ Missing image failed to load (expected):', e)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Information</CardTitle>
          <CardDescription>Check browser console for loading status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open browser developer tools (F12)</li>
              <li>Go to Console tab</li>
              <li>Refresh this page</li>
              <li>Look for ✅ success or ❌ error messages</li>
            </ol>
            <p className="mt-4 text-muted-foreground">
              <strong>Expected:</strong> Tests 1-5 should show ✅ success, Test 6 should show ❌ error
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 