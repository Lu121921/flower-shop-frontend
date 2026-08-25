import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const FAQS = [
  { id: 'delivery', category: 'Delivery', q: 'Do you offer same-day delivery?', a: 'Yes! We offer same-day delivery for orders placed before 1PM Monday to Saturday. Orders placed after 1PM will be delivered the next business day. Select your preferred delivery date and time window at checkout.' },
  { id: 'delivery-area', category: 'Delivery', q: 'What areas do you deliver to?', a: 'We currently deliver across the Greater Sydney metropolitan area, including all suburbs within 50km of the CBD. Enter your postcode at checkout to confirm availability.' },
  { id: 'delivery-cost', category: 'Delivery', q: 'How much does delivery cost?', a: 'Delivery is FREE for all orders over $100. For orders under $100, a flat delivery fee of $9.99 applies. Same-day express delivery is $14.99 for orders placed before 1PM.' },
  { id: 'freshness', category: 'Quality', q: 'How fresh are your flowers?', a: 'All our flowers are sourced fresh from our farm partners every morning. We guarantee that every arrangement uses flowers delivered within 24 hours of harvest to ensure maximum freshness and longevity.' },
  { id: 'lasting', category: 'Quality', q: 'How long will my flowers last?', a: 'With proper care, most of our arrangements last 7–10 days. Roses typically last 5–7 days, while mixed bouquets can last up to 2 weeks. We include care instructions with every order.' },
  { id: 'custom', category: 'Orders', q: 'Can I request a custom arrangement?', a: 'Absolutely! We love creating custom arrangements for special occasions. Contact us via phone or our contact form with your requirements, budget, and occasion, and our florists will create something unique just for you.' },
  { id: 'cancel', category: 'Orders', q: 'Can I cancel or modify my order?', a: 'You can cancel or modify your order up to 2 hours after placing it, or before 12PM on the day of delivery (whichever comes first). Once your order enters preparation, changes may not be possible.' },
  { id: 'corporate', category: 'Orders', q: 'Do you offer corporate flower services?', a: 'Yes, we offer regular flower delivery for offices, hotels, restaurants and events. Contact our corporate team at corporate@lunablooms.com for custom pricing and arrangements.' },
  { id: 'payment', category: 'Payment', q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and Afterpay for orders over $50.' },
  { id: 'refund', category: 'Payment', q: 'What is your refund policy?', a: 'Your satisfaction is guaranteed. If you\'re not completely happy with your flowers, contact us within 24 hours of delivery with a photo and we\'ll send a replacement arrangement or provide a full refund.' },
  { id: 'gift', category: 'Gift & Occasions', q: 'Can I include a gift message?', a: 'Yes! You can add a personalised gift message at checkout. Messages are printed on a card and included with your arrangement. There is no extra charge for this service.' },
  { id: 'subscription', category: 'Gift & Occasions', q: 'Do you offer flower subscriptions?', a: 'Yes! Our Bloom Club subscription delivers fresh flowers to you weekly, fortnightly or monthly. Subscribers receive 15% off all orders and free delivery. Sign up from your account dashboard.' },
]

const CATEGORIES = ['All', ...new Set(FAQS.map(f => f.category))]

export default function FAQ() {
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [openId, setOpenId]   = useState(null)

  const filtered = FAQS.filter(f =>
    (category === 'All' || f.category === category) &&
    (f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-orange-pale to-brand-green-pale py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto">Find answers to the most common questions about our flowers, delivery, and service.</p>
          <div className="max-w-md mx-auto relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…" className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange shadow-card bg-white" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${category === cat ? 'bg-brand-orange text-white shadow-orange' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-orange hover:text-brand-orange'}`}>{cat}</button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {filtered.map(faq => (
            <motion.div key={faq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
                <span className="font-bold text-sm text-gray-800 leading-snug">{faq.q}</span>
                <ChevronDown size={18} className={`text-brand-orange flex-shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-6 pb-5">
                      <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle size={36} className="mx-auto mb-3 opacity-40" />
              <p>No results for "{search}"</p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mt-12 bg-brand-orange rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-extrabold mb-2">Still have questions?</h2>
          <p className="text-white/80 text-sm mb-5">Our friendly team is here to help. Reach out anytime.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-brand-orange font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors text-sm">
            <MessageCircle size={16} /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
