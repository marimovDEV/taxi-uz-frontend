import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get user-friendly error message from API error
 */
export function getErrorMessage(error: any): string {
  if (error.response?.status === 400) {
    return "Noto'g'ri ma'lumotlar kiritildi"
  } else if (error.response?.status === 401) {
    return "Avtorizatsiya talab qilinadi"
  } else if (error.response?.status === 403) {
    return "Ruxsat yo'q"
  } else if (error.response?.status === 404) {
    return "API endpoint topilmadi"
  } else if (error.response?.status >= 500) {
    return "Server xatoligi"
  } else if (error.code === 'ECONNABORTED') {
    return "Vaqt tugadi"
  } else if (!error.response) {
    return "Tarmoq xatoligi"
  }
  
  return error.message || "Noma'lum xatolik"
}

/**
 * Log API error with enhanced details
 */
export function logApiError(error: any, context?: string): void {
  // First, let's log the raw error to see what we're dealing with
  console.error(`${context ? `[${context}] ` : ''}Raw Error:`, error)
  
  // Then log the structured error information
  const errorInfo = {
    message: error?.message || 'Unknown error',
    code: error?.code,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    url: error?.config?.url,
    method: error?.config?.method,
    data: error?.response?.data,
    stack: error?.stack,
    // Add more detailed error information
    name: error?.name,
    isAxiosError: error?.isAxiosError,
    toJSON: error?.toJSON ? error.toJSON() : null
  }
  
  console.error(`${context ? `[${context}] ` : ''}API Error Details:`, errorInfo)
  
  // If it's an Axios error, log additional details
  if (error?.isAxiosError) {
    console.error(`${context ? `[${context}] ` : ''}Axios Error Details:`, {
      request: error.request,
      response: error.response,
      config: error.config
    })
  }
}
