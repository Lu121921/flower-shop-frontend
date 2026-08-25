import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Truck, Clock, CheckCircle2, Package, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Input from '../components/Input'

const TRACKING_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered']

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('')
  const [status, setStatus] = useState(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) {
      setError('Enter your order number')
      return
    }
    setError('')
    setStatus('shipped')
    setDetails({
      order_number: orderNumber.trim(),
      shipped_on: 'Today, 2:30 PM',
      estimated_delivery: 'Tomorrow, 10AM – 1PM',
      tracking_number: `LB-${Math.floor(Math.random() * 900000 + 100000)}`,
      current_location: 'Sydney Flower Hub',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader title="Track Your Order" subtitle="Enter your order number to see the latest delivery status." />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-soft p-8 mt-10">
          <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
            <Input
              label="Order Number"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="e.g. LB-123456"
              icon={Search}
              error={error}
            />
            <button type="submit" className="btn-orange py-3.5">Track Order</button>
          </form>

          {details && (
            <div className="mt-10 space-y-6">
              <div className="rounded-3xl bg-brand-orange-pale p-6 text-gray-800 shadow-card">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-orange">Order status</p>
                <div className="mt-4 text-3xl font-extrabold">{details.order_number}</div>
                <p className="mt-2 text-gray-600">Estimated delivery: <strong>{details.estimated_delivery}</strong></p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-sm text-gray-500">Tracking number</p>
                  <p className="mt-2 font-semibold text-gray-900">{details.tracking_number}</p>
                </div>
                <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-sm text-gray-500">Current location</p>
                  <p className="mt-2 font-semibold text-gray-900">{details.current_location}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-soft">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Timeline</h3>
                <div className="space-y-4">
                  {TRACKING_STEPS.map((step, idx) => {
                    const completed = TRACKING_STEPS.indexOf(step) <= TRACKING_STEPS.indexOf('Shipped')
                    return (
                      <div key={step} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completed ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {idx < 2 ? <Clock size={18} /> : idx === 2 ? <Package size={18} /> : idx === 3 ? <Truck size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        <div>
                          <p className={`font-semibold ${completed ? 'text-gray-900' : 'text-gray-500'}`}>{step}</p>
                          <p className="text-sm text-gray-500">{completed ? 'Complete' : 'Pending'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {!details && (
            <div className="mt-10 rounded-3xl bg-gray-50 p-8 text-center text-gray-600">
              <p className="font-semibold text-gray-800">Need help?</p>
              <p className="text-sm mt-2">If you don’t have your order number, please contact support.</p>
              <button onClick={() => navigate('/contact')} type="button" className="btn-white mt-4">Contact Support</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
