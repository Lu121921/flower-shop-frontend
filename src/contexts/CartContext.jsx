import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext({})

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lb_cart')
      if (saved) setCartItems(JSON.parse(saved))
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!loading) localStorage.setItem('lb_cart', JSON.stringify(cartItems))
  }, [cartItems, loading])

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        toast.success('Cart updated')
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      toast.success('Added to cart 🛍️')
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId))
    toast.success('Removed from cart')
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) { removeFromCart(productId); return }
    setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i))
  }

  const clearCart = () => { setCartItems([]); localStorage.removeItem('lb_cart') }

  const getCartTotal  = () => cartItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
  const getCartCount  = () => cartItems.reduce((s, i) => s + i.quantity, 0)
  const isInCart      = (id) => cartItems.some(i => i.id === id)

  return (
    <CartContext.Provider value={{
      cartItems, loading,
      addToCart, removeFromCart, updateQuantity, clearCart,
      getCartTotal, getCartCount, isInCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}
