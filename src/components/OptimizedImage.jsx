import { useState } from 'react'

const FALLBACK = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=75&auto=format&fit=crop'

/** Consistent lazy-loading, async decoding and graceful image fallback. */
export default function OptimizedImage({ src, alt, className = '', priority = false, sizes = '100vw', ...props }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed || !src ? FALLBACK : src}
      alt={alt || "Luna Bloom's flower arrangement"}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      sizes={sizes}
      onError={() => setFailed(true)}
      {...props}
    />
  )
}
