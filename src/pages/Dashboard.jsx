import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Heart, User, MapPin, ShoppingBag, ArrowRight, Star, Clock } from 'lucide-react'
import { orderAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import Badge from '../components/Badge'
import Loading from '../components/Loading'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'
const STATUS_COLORS = { pending: 'yellow', confirmed: 'blue', processing: 'orange', shipped: 'blue', delivered: 'success', cancelled: 'red', refunded: 'gray' }

export default function Dashboard() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()
  const { cartItems, getCartTotal } = useCart()
  const { items: wishItems } = useWishlist()

  useEffect(() => {
    orderAPI.getAll({ limit: 5 })
      .then(r => setOrders(r.data?.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { icon: Package,  label: 'Total Orders',    value: orders.length, href: '/orders',   color: 'bg-blue-50 text-blue-600' },
    { icon: Heart,    label: 'Wishlist Items',   value: wishItems.length, href: '/wishlist', color: 'bg-red-50 text-red-500' },
    { icon: ShoppingBag, label: 'Cart Items',  value: cartItems.reduce((s, i) => s + i.quantity, 0), href: '/cart', color: 'bg-orange-50 text-brand-orange' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-2xl p-6 md:p-8 text-white mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 🌸</h1>
          <p className="text-white/80 text-sm mt-1">Here's what's happening with your account today.</p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-brand-orange font-bold px-4 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors">Shop Now <ArrowRight size={14} /></Link>
            <Link to="/profile" className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-4 py-2.5 rounded-full text-sm hover:bg-white/30 transition-colors">Edit Profile</Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, href, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={href} className="block bg-white rounded-2xl p-5 shadow-soft hover:shadow-card-hover transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={18} /></div>
                <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">{label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Package,  label: 'My Orders',   to: '/orders',   desc: 'Track your orders' },
            { icon: Heart,    label: 'Wishlist',     to: '/wishlist', desc: 'Saved items' },
            { icon: User,     label: 'Profile',      to: '/profile',  desc: 'Account settings' },
            { icon: MapPin,   label: 'Addresses',    to: '/profile#addresses', desc: 'Saved addresses' },
          ].map(({ icon: Icon, label, to, desc }, i) => (
            <Link key={i} to={to} className="bg-white rounded-xl p-4 shadow-soft hover:shadow-card-hover transition-shadow flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-orange-pale flex items-center justify-center flex-shrink-0"><Icon size={16} className="text-brand-orange" /></div>
              <div>
                <div className="font-bold text-sm text-gray-800">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 ml-auto" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-brand-orange font-semibold hover:underline">View all</Link>
          </div>
          {loading ? <Loading text="Loading orders…" /> : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Clock size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No orders yet</p>
              <Link to="/shop" className="btn-orange inline-flex mt-4 text-sm">Start Shopping</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <span className="font-bold text-sm text-gray-800">#{order.order_number}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                    <Badge variant={STATUS_COLORS[order.status] || 'gray'} size="sm">{order.status}</Badge>
                    <ArrowRight size={14} className="text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
