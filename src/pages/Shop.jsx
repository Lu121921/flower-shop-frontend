import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown, ChevronUp } from 'lucide-react'
import { productAPI, categoryAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import QuickView from '../components/QuickView'
import Pagination from '../components/Pagination'
import SectionHeader from '../components/SectionHeader'
import Breadcrumb from '../components/Breadcrumb'

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest' },
  { value: 'price:asc',       label: 'Price: Low to High' },
  { value: 'price:desc',      label: 'Price: High to Low' },
  { value: 'avg_rating:desc', label: 'Top Rated' },
  { value: 'name:asc',        label: 'Name A–Z' },
]

const PRICE_RANGES = [
  { label: 'Under 5,000 ETB',      min: 1000,  max: 5000 },
  { label: '5,000 – 15,000 ETB',   min: 5000,  max: 15000 },
  { label: '15,000 – 35,000 ETB',  min: 15000, max: 35000 },
  { label: 'Over 35,000 ETB',      min: 35000, max: 100000 },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 16, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [expandedSections, setExpandedSections] = useState({ categories: true, price: true, rating: false })

  const search     = searchParams.get('search')     || ''
  const category   = searchParams.get('category')   || ''
  const occasion   = searchParams.get('occasion')   || ''
  const sort       = searchParams.get('sort')        || 'created_at:desc'
  const minPrice   = searchParams.get('min_price')  || ''
  const maxPrice   = searchParams.get('max_price')  || ''
  const featured   = searchParams.get('featured')   || ''
  const page       = parseInt(searchParams.get('page') || '1')

  const [sortBy, orderDir] = sort.split(':')

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  const hasFilters = search || category || occasion || minPrice || maxPrice || featured

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data?.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {
          page, limit: 16, sort_by: sortBy, order: orderDir,
          ...(search && { search }),
          ...(category && { category }),
          ...(occasion && { tags: occasion }),
          ...(minPrice && { min_price: minPrice }),
          ...(maxPrice && { max_price: maxPrice }),
          ...(featured && { featured: true }),
        }
        const r = await productAPI.getAll(params)
        setProducts(r.data?.products || [])
        setPagination(r.pagination || { total: 0, page: 1, limit: 16, totalPages: 1 })
      } catch { setProducts([]) }
      finally { setLoading(false) }
    }
    fetchProducts()
  }, [searchParams])

  const toggleSection = (key) => setExpandedSections(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Breadcrumb items={[{ label: 'Shop' }]} />
          <div className="flex items-end justify-between mt-3">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {category ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  : search ? `Search: "${search}"` : occasion ? `${occasion.replace('_', ' ')} Flowers` : 'All Flowers'}
              </h1>
              {!loading && <p className="text-sm text-gray-500 mt-1">{pagination.total} products found</p>}
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none min-w-0">
            <button onClick={() => setSidebarOpen(v => !v)} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:border-brand-orange hover:text-brand-orange transition-colors flex-shrink-0">
              <SlidersHorizontal size={15} /> Filters {hasFilters && <span className="w-4 h-4 bg-brand-orange text-white text-xs rounded-full flex items-center justify-center leading-none">!</span>}
            </button>
            <div className="relative flex-1 sm:w-52 min-w-[120px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                defaultValue={search}
                placeholder="Search flowers..."
                onKeyDown={e => e.key === 'Enter' && updateParam('search', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <select value={sort} onChange={e => updateParam('sort', e.target.value)} className="text-xs sm:text-sm border border-gray-200 rounded-full px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white font-semibold text-gray-700">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="flex rounded-full border border-gray-200 overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`px-2.5 sm:px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-brand-orange text-white' : 'bg-white text-gray-500 hover:text-brand-orange'}`} aria-label="Grid view"><Grid3X3 size={15} /></button>
              <button onClick={() => setViewMode('list')} className={`px-2.5 sm:px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-brand-orange text-white' : 'bg-white text-gray-500 hover:text-brand-orange'}`} aria-label="List view"><List size={15} /></button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer Backdrop & Slide-over */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative z-10 w-80 max-w-[85vw] h-full bg-white shadow-2xl p-5 overflow-y-auto space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-brand-orange" /> Filter Products
                  </h3>
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <X size={20} />
                  </button>
                </div>

                {/* Categories */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <span className="font-bold text-sm text-gray-800 block">Categories</span>
                  <button onClick={() => { updateParam('category', ''); setSidebarOpen(false) }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!category ? 'bg-brand-orange text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>All Categories</button>
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => { updateParam('category', cat.slug); setSidebarOpen(false) }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat.slug ? 'bg-brand-orange text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{cat.name}</button>
                  ))}
                </div>

                {/* Occasions Filter */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <span className="font-bold text-sm text-gray-800 block">Occasions</span>
                  <div className="space-y-1 max-h-48 overflow-y-auto hide-scrollbar">
                    <button onClick={() => { updateParam('occasion', ''); setSidebarOpen(false) }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!occasion ? 'bg-brand-orange text-white' : 'bg-white text-gray-700'}`}>All Occasions</button>
                    {[
                      { slug: 'birthday', label: 'Birthday' },
                      { slug: 'anniversary', label: 'Anniversary' },
                      { slug: 'valentines', label: "Valentine's Day" },
                      { slug: 'wedding', label: 'Wedding' },
                      { slug: 'engagement', label: 'Engagement' },
                      { slug: 'graduation', label: 'Graduation' },
                      { slug: 'mothers_day', label: "Mother's Day" },
                      { slug: 'fathers_day', label: "Father's Day" },
                      { slug: 'thank_you', label: 'Thank You' },
                      { slug: 'congratulations', label: 'Congratulations' },
                      { slug: 'get_well', label: 'Get Well Soon' },
                      { slug: 'new_baby', label: 'New Baby' },
                      { slug: 'apology', label: 'Apology' },
                      { slug: 'love_romance', label: 'Love & Romance' },
                      { slug: 'friendship', label: 'Friendship' },
                      { slug: 'sympathy', label: 'Sympathy' },
                      { slug: 'celebration', label: 'Celebration' },
                      { slug: 'just_because', label: 'Just Because' },
                    ].map(occ => (
                      <button key={occ.slug} onClick={() => { updateParam('occasion', occ.slug); setSidebarOpen(false) }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${occasion === occ.slug ? 'bg-brand-orange text-white' : 'bg-white text-gray-700'}`}>{occ.label}</button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <span className="font-bold text-sm text-gray-800 block">Price Range</span>
                  {PRICE_RANGES.map(r => {
                    const active = minPrice == r.min && maxPrice == r.max
                    return (
                      <button key={r.label} onClick={() => { updateParam('min_price', r.min); updateParam('max_price', r.max === 100000 ? '' : r.max); setSidebarOpen(false) }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${active ? 'bg-brand-orange text-white' : 'bg-white text-gray-700'}`}>{r.label}</button>
                    )
                  })}
                  <div className="flex gap-2 mt-2">
                    <input type="number" value={minPrice} onChange={e => updateParam('min_price', e.target.value)} placeholder="Min ETB" className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white" />
                    <input type="number" value={maxPrice} onChange={e => updateParam('max_price', e.target.value)} placeholder="Max ETB" className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white" />
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-bold text-sm text-gray-800">Featured Only</span>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${featured ? 'bg-brand-orange' : 'bg-gray-300'}`} onClick={() => updateParam('featured', featured ? '' : 'true')}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${featured ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>
                </div>

                {hasFilters && (
                  <button onClick={() => { clearFilters(); setSidebarOpen(false) }} className="w-full py-2.5 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex gap-7">
          {/* Desktop Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 250 }} exit={{ opacity: 0, width: 0 }} className="flex-shrink-0 hidden md:block overflow-hidden">
                <div className="w-[250px] space-y-4">
                  {/* Categories */}
                  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-gray-800">
                      Categories {expandedSections.categories ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    {expandedSections.categories && (
                      <div className="px-5 pb-4 space-y-1">
                        <button onClick={() => updateParam('category', '')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!category ? 'bg-brand-orange text-white' : 'text-gray-700 hover:bg-gray-50'}`}>All Categories</button>
                        {categories.map(cat => (
                          <button key={cat.id} onClick={() => updateParam('category', cat.slug)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat.slug ? 'bg-brand-orange text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{cat.name}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Occasions Filter */}
                  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <button onClick={() => toggleSection('occasions')} className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-gray-800">
                      Occasions {expandedSections.occasions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    {expandedSections.occasions && (
                      <div className="px-5 pb-4 space-y-1 max-h-60 overflow-y-auto hide-scrollbar">
                        <button onClick={() => updateParam('occasion', '')} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!occasion ? 'bg-brand-orange text-white' : 'text-gray-700 hover:bg-gray-50'}`}>All Occasions</button>
                        {[
                          { slug: 'birthday', label: 'Birthday' },
                          { slug: 'anniversary', label: 'Anniversary' },
                          { slug: 'valentines', label: "Valentine's Day" },
                          { slug: 'wedding', label: 'Wedding' },
                          { slug: 'engagement', label: 'Engagement' },
                          { slug: 'graduation', label: 'Graduation' },
                          { slug: 'mothers_day', label: "Mother's Day" },
                          { slug: 'fathers_day', label: "Father's Day" },
                          { slug: 'thank_you', label: 'Thank You' },
                          { slug: 'congratulations', label: 'Congratulations' },
                          { slug: 'get_well', label: 'Get Well Soon' },
                          { slug: 'new_baby', label: 'New Baby' },
                          { slug: 'apology', label: 'Apology' },
                          { slug: 'love_romance', label: 'Love & Romance' },
                          { slug: 'friendship', label: 'Friendship' },
                          { slug: 'sympathy', label: 'Sympathy' },
                          { slug: 'celebration', label: 'Celebration' },
                          { slug: 'just_because', label: 'Just Because' },
                        ].map(occ => (
                          <button key={occ.slug} onClick={() => updateParam('occasion', occ.slug)} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${occasion === occ.slug ? 'bg-brand-orange text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{occ.label}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-gray-800">
                      Price Range {expandedSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    {expandedSections.price && (
                      <div className="px-5 pb-4 space-y-1">
                        {PRICE_RANGES.map(r => {
                          const active = minPrice == r.min && maxPrice == r.max
                          return (
                            <button key={r.label} onClick={() => { updateParam('min_price', r.min); updateParam('max_price', r.max === 100000 ? '' : r.max) }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-orange text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{r.label}</button>
                          )
                        })}
                        <div className="flex gap-2 mt-3">
                          <input type="number" value={minPrice} onChange={e => updateParam('min_price', e.target.value)} placeholder="Min ETB" className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange" />
                          <input type="number" value={maxPrice} onChange={e => updateParam('max_price', e.target.value)} placeholder="Max ETB" className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured toggle */}
                  <div className="bg-white rounded-2xl shadow-soft px-5 py-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-sm text-gray-800">Featured Only</span>
                      <div className={`w-11 h-6 rounded-full transition-colors relative ${featured ? 'bg-brand-orange' : 'bg-gray-200'}`} onClick={() => updateParam('featured', featured ? '' : 'true')}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${featured ? 'translate-x-5' : ''}`} />
                      </div>
                    </label>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? <ProductSkeleton count={16} viewMode={viewMode} /> : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Search size={32} className="text-gray-300" /></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-orange">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'}>
                  {products.map(p => <ProductCard key={p.id} product={p} viewMode={viewMode} onQuickView={setQuickViewProduct} />)}
                </div>
                <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} className="mt-10" />
              </>
            )}
          </div>
        </div>
      </div>

      <QuickView product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}
