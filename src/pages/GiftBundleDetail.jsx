import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, Sparkles, ArrowLeft, ShoppingBag, Tag } from 'lucide-react'
import { bundleAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import toast from 'react-hot-toast'

export default function GiftBundleDetail() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBundle = async () => {
      setLoading(true)
      try {
        const { data } = await bundleAPI.getBySlug(slug)
        setBundle(data.bundle)
      } catch {
        setBundle(null)
      } finally {
        setLoading(false)
      }
    }
    loadBundle()
  }, [slug])

  const handleAddToCart = () => {
    if (!bundle) return
    const bundleProduct = {
      id: `gift-bundle-${bundle.id}`,
      name: bundle.name,
      price: bundle.effective_price || bundle.base_price,
      image_url: bundle.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
      customization_data: {
        is_bundle: true,
        bundle_id: bundle.id,
        items: bundle.gift_bundle_items?.map(i => `${i.products?.name} (x${i.quantity})`) || []
      }
    }

    addToCart(bundleProduct, 1)
    toast.success(`${bundle.name} added to cart! 🎁`)
    navigate('/cart')
  }

  if (loading) return <Loading />
  if (!bundle) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-soft p-10 text-center">
        <p className="text-gray-500">This gift bundle could not be found.</p>
        <Link to="/gift-bundles" className="mt-6 inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline">
          <ArrowLeft size={16} /> Return to bundles
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-brand-orange-pale to-brand-green-pale py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeader title={bundle.name} subtitle="Details and contents for this handcrafted bundle." center />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">Explore what makes this gift bundle a celebration-ready favorite.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Gift Bundles', href: '/gift-bundles' }, { label: bundle.name }]} />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] mt-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-soft p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-3xl bg-brand-orange-pale flex items-center justify-center text-brand-orange">
                <Gift size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Gift Bundle</p>
                <h2 className="text-3xl font-bold text-gray-900">{bundle.name}</h2>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{bundle.description || 'A curated gift set made to impress.'}</p>
            <div className="grid gap-4">
              {(bundle.gift_bundle_items || []).map((item) => (
                <div key={item.id} className="rounded-3xl border border-gray-100 p-4 flex gap-4 items-center">
                  <img src={item.products?.image_url || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'} alt={item.products?.name} className="w-20 h-20 rounded-3xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.products?.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${item.products?.price?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-soft p-8 space-y-6">
            <div className="rounded-3xl bg-brand-orange-pale p-6">
              <p className="text-sm text-gray-500">Bundle value</p>
              <div className="flex items-center justify-between mt-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 line-through">${bundle.base_price?.toFixed(2)}</p>
                  <p className="text-4xl font-extrabold text-gray-900">${bundle.effective_price?.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Save</p>
                  <p className="text-lg font-bold text-brand-orange">{bundle.discount_pct}%</p>
                </div>
              </div>
            </div>

            <Button onClick={handleAddToCart} variant="primary" className="w-full justify-center py-4 text-base font-bold">
              <ShoppingBag size={18} /> Add Bundle to Cart
            </Button>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Perfect for</p>
              <div className="flex flex-wrap gap-2">
                {(bundle.occasion_tags || []).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"><Tag size={12} /> {tag.replace('_', ' ')}</span>
                ))}
              </div>
            </div>

            <Link to="/gift-bundles" className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline pt-2">
              <ArrowLeft size={16} /> Back to bundles
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
