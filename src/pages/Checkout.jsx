import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin, Truck, CreditCard, Check } from 'lucide-react'
import { orderAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/Input'
import toast from 'react-hot-toast'

const STEPS = ['Address', 'Delivery', 'Review']

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'

export default function Checkout() {
  const [step, setStep]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    line1: '', line2: '', city: '', state: '', postal_code: '', country: 'Australia',
  })
  const [delivery, setDelivery] = useState({
    date: '', time: 'morning', gift_message: '', notes: '',
  })
  const [errors, setErrors] = useState({})

  const subtotal = getCartTotal()
  const deliveryFee = subtotal >= 100 ? 0 : 9.99
  const total = subtotal + deliveryFee

  const validateAddress = () => {
    const e = {}
    if (!address.full_name) e.full_name = 'Required'
    if (!address.phone) e.phone = 'Required'
    if (!address.line1) e.line1 = 'Required'
    if (!address.city) e.city = 'Required'
    if (!address.state) e.state = 'Required'
    if (!address.postal_code) e.postal_code = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validateAddress()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [paymentMethod, setPaymentMethod] = useState('card')

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      // Map valid UUID products or custom bouquet items
      const items = cartItems.map(i => ({
        product_id: i.id.startsWith('custom-') || i.id.startsWith('gift-bundle-') ? null : i.id,
        product_name: i.name,
        product_image: i.image_url,
        quantity: i.quantity,
        unit_price: i.price,
        customization_data: i.customization_data || {}
      })).filter(i => i.product_id || i.product_name)

      const res = await orderAPI.create({
        items,
        shipping_address: address,
        delivery_date: delivery.date || null,
        delivery_time: delivery.time,
        gift_message: delivery.gift_message || null,
        notes: delivery.notes || null,
      })
      clearCart()
      toast.success('Order placed successfully! 🌸')
      if (paymentMethod === 'card') {
        navigate(`/payment?order_id=${res.data.order.id}`)
      } else {
        navigate(`/orders/${res.data.order.id}?success=1`)
      }
    } catch { /* handled by axios */ }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-1 sm:gap-2 mb-8 sm:mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm flex-shrink-0 transition-all ${i < step ? 'bg-brand-green text-white' : i === step ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs sm:text-sm font-semibold truncate ${i === step ? 'text-brand-orange font-bold' : i < step ? 'text-brand-green' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`hidden xs:block sm:block flex-1 h-0.5 min-w-[12px] ${i < step ? 'bg-brand-green' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-soft space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-brand-orange-pale flex items-center justify-center"><MapPin size={18} className="text-brand-orange" /></div>
                  <h2 className="font-bold text-lg text-gray-800">Delivery Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" required value={address.full_name} onChange={e => setAddress(a => ({ ...a, full_name: e.target.value }))} error={errors.full_name} />
                  <Input label="Phone" required value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} error={errors.phone} />
                </div>
                <Input label="Address Line 1" required value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} error={errors.line1} />
                <Input label="Address Line 2" value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} hint="Apartment, suite, etc. (optional)" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input label="City" required value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} error={errors.city} />
                  <Input label="State" required value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} error={errors.state} />
                  <Input label="Postal Code" required value={address.postal_code} onChange={e => setAddress(a => ({ ...a, postal_code: e.target.value }))} error={errors.postal_code} />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-soft space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-brand-orange-pale flex items-center justify-center"><Truck size={18} className="text-brand-orange" /></div>
                  <h2 className="font-bold text-lg text-gray-800">Delivery Options</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Delivery Date</label>
                    <input type="date" value={delivery.date} min={new Date().toISOString().split('T')[0]} onChange={e => setDelivery(d => ({ ...d, date: e.target.value }))} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Time</label>
                    <select value={delivery.time} onChange={e => setDelivery(d => ({ ...d, time: e.target.value }))} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                      {[['morning', 'Morning (8AM–12PM)'], ['afternoon', 'Afternoon (12PM–5PM)'], ['evening', 'Evening (5PM–8PM)']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gift Message (optional)</label>
                  <textarea value={delivery.gift_message} onChange={e => setDelivery(d => ({ ...d, gift_message: e.target.value }))} rows={3} placeholder="Add a personal message for the recipient…" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Notes (optional)</label>
                  <textarea value={delivery.notes} onChange={e => setDelivery(d => ({ ...d, notes: e.target.value }))} rows={2} placeholder="Any special instructions…" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Items review */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <h2 className="font-bold text-lg text-gray-800 mb-4">Review Your Order</h2>
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img src={item.image_url || PLACEHOLDER} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" onError={e => { e.target.src = PLACEHOLDER }} />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address review */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-gray-800">Delivering To</span>
                    <button onClick={() => setStep(0)} className="text-xs text-brand-orange font-semibold hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-gray-600">{address.full_name} · {address.phone}</p>
                  <p className="text-sm text-gray-600">{address.line1}{address.line2 ? ', ' + address.line2 : ''}</p>
                  <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
                  <span className="font-bold text-sm text-gray-800 block mb-2">Select Payment Method</span>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition ${paymentMethod === 'card' ? 'border-brand-orange bg-brand-orange-pale' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-brand-orange" />
                      <div>
                        <p className="font-bold text-sm text-gray-900">Credit / Debit Card Online</p>
                        <p className="text-xs text-gray-500">Pay securely via gateway with card encryption</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <Check size={12} />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition ${paymentMethod === 'cod' ? 'border-brand-orange bg-brand-orange-pale' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck size={20} className="text-brand-orange" />
                      <div>
                        <p className="font-bold text-sm text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay in person upon receiving your flowers</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <Check size={12} />}
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="text-sm font-semibold text-gray-600 hover:text-brand-orange transition-colors">← Back</button>
              ) : (
                <a href="/cart" className="text-sm font-semibold text-gray-600 hover:text-brand-orange transition-colors">← Cart</a>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={handleNext} className="btn-orange">Continue <ChevronRight size={16} /></button>
              ) : (
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-orange">
                  {loading ? 'Placing Order…' : 'Place Order'} <Check size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="bg-white rounded-2xl p-5 shadow-soft h-fit sticky top-24">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 bg-brand-orange-pale rounded-xl p-3 text-xs text-brand-orange font-medium">
              <Truck size={15} className="flex-shrink-0 mt-0.5" />
              {deliveryFee === 0 ? 'You qualify for free delivery!' : `Add $${(100 - subtotal).toFixed(2)} more for free delivery`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
