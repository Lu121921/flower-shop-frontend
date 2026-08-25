import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tags, ArrowRight } from 'lucide-react'
import { categoryAPI, productAPI } from '../services/api'
import SectionHeader from '../components/SectionHeader'
import Loading from '../components/Loading'

const CATEGORY_IMAGES = {
  bouquets: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=80',
  'hat-boxes': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=900&q=80',
  plants: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=80',
  'gift-hampers': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&q=80',
  seasonal: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=900&q=80',
  weddings: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80',
  'dried-flowers': 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=900&q=80',
  greenery: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=80',
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const [catRes, featRes] = await Promise.all([categoryAPI.getAll(), productAPI.getFeatured(6)])
        setCategories(catRes.data?.categories || [])
        setFeatured(featRes.data?.products || [])
      } catch {
        setCategories([])
        setFeatured([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-orange-pale to-brand-green-pale py-20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(232,80,10,0.2),_transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-brand-orange mb-4">
              <Tags size={16} /> Explore Collections
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight">Discover every flower collection with ease.</h1>
            <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">Browse curated categories for every gift, occasion, and style. Find the perfect bloom in seconds with our beautifully organised collection pages.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="btn-orange">Browse All Products</Link>
              <Link to="/flower-meanings" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors">Flower Meanings <ArrowRight size={16} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <SectionHeader title="Shop by Category" subtitle="Elegant blooms organised for every moment" />
        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id || category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="group overflow-hidden rounded-[2rem] shadow-card bg-white"
              >
                <Link to={`/shop?category=${category.slug}`} className="block overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={CATEGORY_IMAGES[category.slug] || category.image_url || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=80'}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[3.4rem]">{category.description || 'Explore premium flowers and curated arrangements for every occasion.'}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-brand-orange font-semibold">Shop category <ArrowRight size={14} /></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Featured Collections" subtitle="Selected by our florists" viewAllHref="/shop?featured=true" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 rounded-[2rem] bg-gray-100 animate-pulse" />
            )) : featured.map(product => (
              <Link key={product.id} to={`/shop/${product.id}`} className="block group overflow-hidden rounded-[2rem] shadow-card bg-white">
                <div className="relative h-72 overflow-hidden">
                  <img src={product.image_url || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=80'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.categories?.name || 'Floral Collection'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
