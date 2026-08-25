import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, Sparkles, Tag } from 'lucide-react'
import { bundleAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'
import SectionHeader from '../components/SectionHeader'

const OCCASIONS = ['Birthday', 'Anniversary', 'Thank You', 'Congratulations', 'Sympathy', 'New Baby']

export default function GiftBundles() {
  const { addToCart } = useCart()
  const [bundles, setBundles] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBundles = async () => {
      setLoading(true)
      try {
        const { data } = await bundleAPI.getAll(filter ? { occasion: filter.toLowerCase().replace(' ', '_') } : {})
        setBundles(data?.bundles || [])
      } catch {
        setBundles([])
      } finally {
        setLoading(false)
      }
    }
    loadBundles()
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-brand-orange-pale to-brand-green-pale py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeader
            title="Gift bundles made for every moment"
            subtitle="Curated gift sets paired with premium blooms, handcrafted for celebration and surprise."
            center
          />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Discover beautifully assembled bundles with built-in value, design flair, and thoughtful extras.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Gift Bundles' }]} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Curated sets designed to delight</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Filter by occasion and explore premium gift bundles ready to send.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === '' ? 'bg-brand-orange text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              All
            </button>
            {OCCASIONS.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === item ? 'bg-brand-orange text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {loading ? <Loading /> : bundles.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-soft p-10 text-center">
              <p className="text-gray-500">No gift bundles match that occasion. Try another filter.</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {bundles.map((bundle) => (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} key={bundle.id} className="bg-white rounded-3xl shadow-soft overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange-pale px-3 py-1 text-xs font-semibold text-brand-orange uppercase tracking-[0.2em]">
                          <Gift size={14} /> Bundle
                        </div>
                        <h3 className="mt-4 text-2xl font-bold text-gray-900">{bundle.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">${bundle.base_price?.toFixed(2)}</p>
                        <p className="text-3xl font-extrabold text-gray-900">${bundle.effective_price?.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{bundle.description || 'A beautifully curated gift set to celebrate a special moment.'}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(bundle.gift_bundle_items || []).map((item) => (
                        <div key={item.id} className="rounded-3xl bg-gray-50 p-4 flex items-center gap-3">
                          <img src={item.products?.image_url || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'} alt={item.products?.name} className="w-16 h-16 rounded-2xl object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{item.products?.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            addToCart({
                              id: `gift-bundle-${bundle.id}`,
                              name: bundle.name,
                              price: bundle.effective_price || bundle.base_price,
                              image_url: bundle.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
                              customization_data: { is_bundle: true, bundle_id: bundle.id }
                            }, 1)
                          }}
                          className="btn-orange py-2 px-4 text-xs font-bold"
                        >
                          Add to Cart
                        </button>
                        <Link to={`/gift-bundles/${bundle.slug}`} className="inline-flex items-center gap-1.5 text-brand-orange font-semibold text-xs hover:underline">
                          Details <Sparkles size={14} />
                        </Link>
                      </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
