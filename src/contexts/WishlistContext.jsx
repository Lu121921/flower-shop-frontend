import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext({})

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lb_wishlist')
      if (saved) setItems(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem('lb_wishlist', JSON.stringify(items))
  }, [items])

  const toggleWishlist = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        toast.success('Removed from wishlist')
        return prev.filter(i => i.id !== product.id)
      }
      toast.success('Added to wishlist ♡')
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setItems(prev => prev.filter(i => i.id !== productId))
    toast.success('Removed from wishlist')
  }

  const isInWishlist = (productId) => items.some(i => i.id === productId)
  const clearWishlist = () => setItems([])

  return (
    <WishlistContext.Provider value={{
      items,
      wishlistCount: items.length,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}
