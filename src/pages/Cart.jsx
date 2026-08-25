import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'

const COUPONS = { 'BLOOM10': 10, 'WELCOME20': 20, 'LUNA15': 15 }

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const subtotal     = getCartTotal()
  const discountPct  = appliedCoupon ? COUPONS[appliedCoupon] : 0
  const discount     = subtotal * discountPct / 100
  const deliveryFee  = subtotal >= 100 ? 0 : 9.99
  const total        = subtotal - discount + deliveryFee

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim()
    if (COUPONS[code]) {
      setAppliedCoupon(code)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Looks like you haven't added any flowers yet. Start shopping to fill it up!" actionHref="/shop" actionLabel="Continue Shopping" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <SectionHeader title={`Shopping Cart (${cartItems.length})`} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-soft flex flex-row gap-3 sm:gap-4 items-start sm:items-center">
                  <Link to={`/shop/${item.id}`} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item.image_url || PLACEHOLDER} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER }} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/shop/${item.id}`} className="font-bold text-gray-800 hover:text-brand-orange transition-colors text-xs sm:text-sm line-clamp-2">{item.name}</Link>
                      <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0" aria-label="Remove item"><Trash2 size={14} /></button>
                    </div>
                    {item.categories?.name && <p className="text-xs text-brand-orange font-medium mt-0.5">{item.categories.name}</p>}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"><Minus size={12} /></button>
                        <span className="w-7 sm:w-9 text-center text-xs sm:text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"><Plus size={12} /></button>
                      </div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={clearCart} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 font-semibold transition-colors mt-2"><X size={14} /> Clear Cart</button>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-soft">
              <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2"><Tag size={15} className="text-brand-orange" /> Have a coupon?</h3>
              <div className="flex gap-2">
                <input value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError('') }} placeholder="Enter code" className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange uppercase" />
                <button onClick={applyCoupon} className="btn-orange !py-2.5 !px-4 text-xs">Apply</button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              {appliedCoupon && <p className="text-xs text-green-600 mt-1.5 font-semibold">✓ {appliedCoupon} applied — {discountPct}% off!</p>}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
              <h3 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discountPct}%)</span><span className="font-semibold">-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                {subtotal < 100 && <p className="text-xs text-gray-400">Add ${(100 - subtotal).toFixed(2)} more for free delivery</p>}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="btn-orange w-full justify-center text-sm mt-2 py-3.5">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/shop" className="flex items-center justify-center text-sm text-gray-500 hover:text-brand-orange transition-colors mt-2">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
