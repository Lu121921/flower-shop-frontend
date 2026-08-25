import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight, CheckCircle2, Clock, Truck, XCircle, RotateCcw, ArrowLeft } from 'lucide-react'
import { orderAPI } from '../services/api'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'

const STATUS_COLORS = { pending: 'yellow', confirmed: 'blue', processing: 'orange', shipped: 'blue', delivered: 'success', cancelled: 'red', refunded: 'gray' }
const STATUS_ICONS  = { pending: Clock, confirmed: CheckCircle2, processing: Package, shipped: Truck, delivered: CheckCircle2, cancelled: XCircle, refunded: RotateCcw }

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'

export default function Orders() {
  const { id } = useParams()

  if (id) return <OrderDetail orderId={id} />
  return <OrderList />
}

function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [total, setTotal]     = useState(0)
  const LIMIT = 10

  useEffect(() => {
    setLoading(true)
    orderAPI.getAll({ page, limit: LIMIT })
      .then(r => { setOrders(r.data?.orders || []); setTotal(r.pagination?.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
        {loading ? <Loading /> : orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet" description="Your order history will appear here once you place your first order." actionHref="/shop" actionLabel="Start Shopping" />
        ) : (
          <>
            <div className="space-y-4">
              {orders.map(order => {
                const Icon = STATUS_ICONS[order.status] || Clock
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Link to={`/orders/${order.id}`} className="block bg-white rounded-2xl shadow-soft p-5 hover:shadow-card-hover transition-shadow">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-orange-pale flex items-center justify-center flex-shrink-0">
                            <Icon size={18} className="text-brand-orange" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">Order #{order.order_number}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                          <Badge variant={STATUS_COLORS[order.status] || 'gray'}>{order.status}</Badge>
                          <ChevronRight size={16} className="text-gray-300" />
                        </div>
                      </div>
                      {order.order_items?.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-hidden">
                          {order.order_items.slice(0, 4).map((item, i) => (
                            <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img src={item.product_image || PLACEHOLDER} alt={item.product_name} className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER }} />
                            </div>
                          ))}
                          {order.order_items.length > 4 && <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+{order.order_items.length - 4}</div>}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            <Pagination page={page} totalPages={Math.ceil(total / LIMIT)} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </div>
    </div>
  )
}

function OrderDetail({ orderId }) {
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')

  useEffect(() => {
    orderAPI.getById(orderId)
      .then(r => setOrder(r.data?.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderId])

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setCancelling(true)
    await orderAPI.cancel(orderId, 'Customer requested cancellation')
    const r = await orderAPI.getById(orderId)
    setOrder(r.data?.order)
    setCancelling(false)
  }

  if (loading) return <Loading />
  if (!order)  return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Order not found</p></div>

  const TRACKING_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const stepIdx = TRACKING_STEPS.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange mb-6 transition-colors"><ArrowLeft size={15} /> All Orders</Link>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800">Order Placed Successfully! 🌸</p>
              <p className="text-sm text-green-600 mt-0.5">Thank you for your order. We'll start preparing your flowers right away.</p>
            </div>
          </motion.div>
        )}

        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Order #{order.order_number}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={STATUS_COLORS[order.status] || 'gray'} size="lg">{order.status}</Badge>
            {['pending', 'confirmed'].includes(order.status) && (
              <button onClick={handleCancel} disabled={cancelling} className="text-sm text-red-500 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors font-semibold">
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Tracking */}
        {!['cancelled', 'refunded'].includes(order.status) && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-5">Order Tracking</h2>
            <div className="overflow-x-auto hide-scrollbar pb-2">
              <div className="flex items-start justify-between relative min-w-[280px]">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                <div className="absolute top-4 left-0 h-0.5 bg-brand-orange z-0 transition-all duration-500" style={{ width: `${stepIdx >= 0 ? (stepIdx / (TRACKING_STEPS.length - 1)) * 100 : 0}%` }} />
                {TRACKING_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-2 relative z-10" style={{ flex: 1 }}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${i <= stepIdx ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-200'}`}>
                      {i <= stepIdx ? <CheckCircle2 size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold capitalize text-center ${i <= stepIdx ? 'text-brand-orange' : 'text-gray-400'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            {order.tracking_number && <p className="text-sm text-gray-600 mt-4">Tracking number: <span className="font-bold">{order.tracking_number}</span></p>}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-soft p-6">
            <h2 className="font-bold text-gray-800 mb-4">Items ({order.order_items?.length})</h2>
            <div className="space-y-4">
              {order.order_items?.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.product_image || PLACEHOLDER} alt={item.product_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" onError={e => { e.target.src = PLACEHOLDER }} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{item.product_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">${Number(item.total_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-soft p-5">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
                {order.discount_amount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${Number(order.discount_amount).toFixed(2)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.delivery_fee == 0 ? 'FREE' : `$${Number(order.delivery_fee).toFixed(2)}`}</span></div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900"><span>Total</span><span>${Number(order.total_amount).toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-5">
              <h3 className="font-bold text-gray-800 mb-2 text-sm">Delivering To</h3>
              <p className="text-sm text-gray-600">{order.shipping_address?.full_name}</p>
              <p className="text-sm text-gray-600">{order.shipping_address?.line1}</p>
              <p className="text-sm text-gray-600">{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
