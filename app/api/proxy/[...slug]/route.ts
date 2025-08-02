import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://46.173.29.248'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'PATCH')
}

async function handleRequest(
  request: NextRequest,
  params: { slug: string[] },
  method: string
) {
  try {
    const slug = params.slug || []
    const path = slug.join('/')
    const url = `${BACKEND_URL}/api/${path}`
    
    console.log(`🌐 Proxy request: ${method} ${url}`)
    
    // Request headers ni tozalash
    const headers = new Headers()
    request.headers.forEach((value, key) => {
      // Host header ni o'chirish, chunki backend server uchun
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value)
      }
    })
    
    // Content-Type ni saqlash
    if (request.headers.get('content-type')) {
      headers.set('Content-Type', request.headers.get('content-type')!)
    }
    
    // Request body ni olish
    let body: string | undefined
    if (!['GET', 'HEAD'].includes(method)) {
      body = await request.text()
    }
    
    // Backend server ga so'rov yuborish
    const response = await fetch(url, {
      method,
      headers,
      body,
    })
    
    // Response ni olish
    const responseText = await response.text()
    
    console.log(`✅ Proxy response: ${response.status} ${response.statusText}`)
    
    // Response headers ni tozalash
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      // CORS headers ni qo'shish
      if (key.toLowerCase() === 'access-control-allow-origin') {
        responseHeaders.set(key, '*')
      } else if (key.toLowerCase() !== 'content-encoding') {
        responseHeaders.set(key, value)
      }
    })
    
    // CORS headers ni qo'shish
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
    
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 