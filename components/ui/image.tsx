'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  className?: string
}

export function Image({ 
  src, 
  alt, 
  fallbackSrc = "/placeholder.svg", 
  className,
  onError,
  ...props 
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && imgSrc !== fallbackSrc) {
      console.warn(`Image failed to load: ${imgSrc}, falling back to: ${fallbackSrc}`)
      setImgSrc(fallbackSrc)
      setHasError(true)
    } else if (hasError) {
      console.error(`Fallback image also failed to load: ${fallbackSrc}`)
    }
    
    if (onError) {
      onError(e)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn("object-contain", className)}
      onError={handleError}
      {...props}
    />
  )
} 