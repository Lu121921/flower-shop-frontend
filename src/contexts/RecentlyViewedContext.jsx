import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RecentlyViewedContext = createContext({})

export const useRecentlyViewed = () => {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}

const MAX_ITEMS = 8

export const RecentlyViewedProvider = ({ children }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lb_recently_viewed')
      if (saved) setItems(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem('lb_recently_viewed', JSON.stringify(items))
  }, [items])

  const addProduct = useCallback((product) => {
    if (!product?.id) return
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== product.id)
      return [product, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  const clearHistory = () => setItems([])

  return (
    <RecentlyViewedContext.Provider value={{ items, addProduct, clearHistory }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}
