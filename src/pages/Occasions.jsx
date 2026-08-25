import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift, Heart, Sparkles, Flower2, Baby, Sun, Shield, Award,
  ArrowRight, Check, Star, Filter, RefreshCw
} from 'lucide-react'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import SectionHeader from '../components/SectionHeader'
import Breadcrumb from '../components/Breadcrumb'
import QuickView from '../components/QuickView'
import Loading from '../components/Loading'

export const OCCASIONS_DATA = [
  {
    slug: 'birthday',
    name: 'Birthday',
    subtitle: 'Celebrate Another Year of Joy',
    description: 'Vibrant, cheerful bouquets crafted to bring pure delight and smiles on their special day.',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=900&q=80',
    flowers: 'Sunflowers, Gerberas, Mixed Roses, Tulips',
    badge: 'Popular'
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    subtitle: 'Honor Timeless Love Stories',
    description: 'Express deep devotion and eternal romance with Ecuadorian roses, blush peonies, and luxury hat boxes.',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=900&q=80',
    flowers: 'Red Roses, Peonies, Phalaenopsis Orchids',
    badge: 'Romantic'
  },
  {
    slug: 'valentines',
    name: "Valentine's Day",
    subtitle: 'Speak the Language of Passion',
    description: 'Classic velvet red roses and romantic blush petals designed to capture hearts on the day of love.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80',
    flowers: 'Red Ecuadorian Roses, Pink Tulips, Blush Peonies',
    badge: 'Trending'
  },
  {
    slug: 'wedding',
    name: 'Wedding',
    subtitle: 'Blooms for Your Forever Moment',
    description: 'Exquisite bridal bouquets, delicate centerpieces, and white garden florals for magical wedding vows.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80',
    flowers: 'White Lilies, Peonies, Orchids, Baby’s Breath',
    badge: 'Luxury'
  },
  {
    slug: 'engagement',
    name: 'Engagement',
    subtitle: 'Toast to a Lifetime Together',
    description: 'Romantic pastel arrangements and champagne-hued roses to celebrate the exciting proposal journey.',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=900&q=80',
    flowers: 'Garden Roses, Peonies, Hydrangeas',
    badge: 'Celebratory'
  },
  {
    slug: 'graduation',
    name: 'Graduation',
    subtitle: 'Honor Big Milestone Achievements',
    description: 'Vibrant, energetic bouquets of sunflowers, chrysanthemums, and bold blooms for proud graduates.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=900&q=80',
    flowers: 'Sunflowers, Gerberas, Chrysanthemums',
    badge: 'Inspiring'
  },
  {
    slug: 'mothers_day',
    name: "Mother's Day",
    subtitle: 'Show Warmth & Endless Gratitude',
    description: 'Gentle pastels, soft carnations, and fragrant lilies that express endless warmth, care, and love.',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=80',
    flowers: 'Carnations, Pink Lilies, Hydrangeas, Tulips',
    badge: 'Heartfelt'
  },
  {
    slug: 'fathers_day',
    name: "Father's Day",
    subtitle: 'Distinctive Botanicals for Remarkable Fathers',
    description: 'Sophisticated potted orchids, crisp dried arrangements, and bold architectural greenery hampers.',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=900&q=80',
    flowers: 'Phalaenopsis Orchids, Sunflowers, Exotic Plants',
    badge: 'Refined'
  },
  {
    slug: 'thank_you',
    name: 'Thank You',
    subtitle: 'Express Sincere Heartfelt Gratitude',
    description: 'Warm yellow stems, fresh mixed bouquets, and fragrant hydrangeas that say "Thank You" with elegance.',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=900&q=80',
    flowers: 'Hydrangeas, Sunflowers, Daisies, Lilies',
    badge: 'Appreciated'
  },
  {
    slug: 'congratulations',
    name: 'Congratulations',
    subtitle: 'Celebrate Victories & Breakthroughs',
    description: 'Bold, triumphant floral arrangements and luxury gift hampers packed with celebratory delight.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&q=80',
    flowers: 'Mixed Gerberas, Bright Lilies, Roses',
    badge: 'Triumphant'
  },
  {
    slug: 'get_well',
    name: 'Get Well Soon',
    subtitle: 'Send Uplifting Sunshine & Comfort',
    description: 'Bright, uplifting sunflowers, gentle chamomiles, and fresh green scents that cheer the spirit.',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=900&q=80',
    flowers: 'Sunflowers, Daisies, Chamomile, Mixed Stems',
    badge: 'Comforting'
  },
  {
    slug: 'new_baby',
    name: 'New Baby',
    subtitle: 'Welcome Precious New Arrivals',
    description: 'Soft lavender buds, delicate blush roses, and cloud-like baby’s breath to celebrate precious life.',
    image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=900&q=80',
    flowers: 'Baby’s Breath, Lavender, Soft Pink/White Roses',
    badge: 'Sweet'
  },
  {
    slug: 'apology',
    name: "Apology / I'm Sorry",
    subtitle: 'Mend Hearts with Peaceful Grace',
    description: 'Pure white lilies, soft blush roses, and serene arrangements that convey genuine, heartfelt apologies.',
    image: 'https://images.unsplash.com/photo-1588628566587-dbd176de562b?w=900&q=80',
    flowers: 'White Lilies, White Roses, Hydrangeas',
    badge: 'Sincere'
  },
  {
    slug: 'love_romance',
    name: 'Love & Romance',
    subtitle: 'Passionate Blooms for Unforgettable Moments',
    description: 'Deep red Ecuadorian roses, lush pink peonies, and velvet hat boxes designed for deep affection.',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=900&q=80',
    flowers: 'Red Roses, Peonies, Orchids',
    badge: 'Passionate'
  },
  {
    slug: 'friendship',
    name: 'Friendship',
    subtitle: 'Honor Loyal Friends & True Connection',
    description: 'Golden yellow roses, cheerful daisies, and colorful mixed hand-tied bouquets that celebrate true bond.',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=900&q=80',
    flowers: 'Yellow Roses, Gerberas, Daisies, Tulips',
    badge: 'Warm'
  },
  {
    slug: 'sympathy',
    name: 'Sympathy / Condolences',
    subtitle: 'Offer Solace, Peace & Gentle Comfort',
    description: 'Serene white lilies, peaceful orchids, and quiet green arrangements to honor cherished memories.',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=900&q=80',
    flowers: 'White Lilies, Orchids, White Chrysanthemums',
    badge: 'Peaceful'
  },
  {
    slug: 'celebration',
    name: 'Celebration',
    subtitle: 'Turn Milestones into Grand Festivities',
    description: 'Extravagant multi-flower hat boxes and vibrant floral hampers created for joyful gatherings.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&q=80',
    flowers: 'Mixed Roses, Lilies, Gerberas, Chrysanthemums',
    badge: 'Grand'
  },
  {
    slug: 'just_because',
    name: 'Just Because',
    subtitle: 'Spontaneous Blooms to Share Unexpected Joy',
    description: 'Delightful seasonal arrangements and long-lasting lavender stems sent simply to bring a smile.',
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=900&q=80',
    flowers: 'Lavender, Tulips, Wildflower Mix',
    badge: 'Spontaneous'
  }
]

export default function Occasions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeOccasionSlug = searchParams.get('occasion') || ''

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [counts, setCounts] = useState({})

  // Fetch all product counts per occasion
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await productAPI.getAll({ limit: 100 })
        const allProds = res.data?.products || []
        const countMap = {}
        OCCASIONS_DATA.forEach(occ => {
          const matchCount = allProds.filter(p => {
            if (!p.tags || !Array.isArray(p.tags)) return false
            return p.tags.some(t => {
              const clean = t.toLowerCase()
              return clean === occ.slug || clean === `occasion:${occ.slug}`
            })
          }).length
          countMap[occ.slug] = matchCount
        })
        setCounts(countMap)
      } catch {
        setCounts({})
      }
    }
    fetchAll()
  }, [])

  // Fetch products when selected occasion changes
  useEffect(() => {
    if (!activeOccasionSlug) {
      setProducts([])
      return
    }
    const fetchOccasionProducts = async () => {
      setLoadingProducts(true)
      try {
        const res = await productAPI.getAll({ tags: activeOccasionSlug, limit: 20 })
        setProducts(res.data?.products || [])
      } catch {
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchOccasionProducts()
  }, [activeOccasionSlug])

  const handleSelectOccasion = (slug) => {
    if (activeOccasionSlug === slug) {
      setSearchParams({})
    } else {
      setSearchParams({ occasion: slug })
      const el = document.getElementById('occasion-product-grid')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const selectedOccasionData = OCCASIONS_DATA.find(o => o.slug === activeOccasionSlug)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-orange-pale via-amber-50 to-brand-green-pale py-20 border-b border-gray-100">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_rgba(232,80,10,0.3),_transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <Breadcrumb items={[{ label: 'Occasions' }]} />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.3em] text-brand-orange mb-3">
              <Sparkles size={16} /> Luna Bloom's Occasion Edits
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Flowers Hand-Crafted for Every Cherished Moment
            </h1>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Explore 18 curated occasion collections designed to express affection, gratitude, comfort, and celebration with fresh luxury blooms in Ethiopian Birr.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── OCCASIONS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <SectionHeader
          title="Browse All 18 Occasions"
          subtitle="Select an occasion below to view matching luxury arrangements."
          center
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {OCCASIONS_DATA.map((occ, index) => {
            const isSelected = activeOccasionSlug === occ.slug
            const prodCount = counts[occ.slug] || 0

            return (
              <motion.div
                key={occ.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`group rounded-[2rem] bg-white shadow-soft hover:shadow-card-hover overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between ${
                  isSelected ? 'border-brand-orange ring-4 ring-brand-orange/10' : 'border-gray-100 hover:border-brand-orange/40'
                }`}
              >
                <div>
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={occ.image}
                      alt={occ.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-brand-orange font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                        {occ.badge}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full">
                        {prodCount} {prodCount === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-bold tracking-tight">{occ.name}</h3>
                      <p className="text-xs text-amber-200/90 font-medium">{occ.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem]">
                      {occ.description}
                    </p>
                    
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">Blooms:</span>
                      <span className="truncate max-w-[200px] text-brand-orange font-medium">{occ.flowers}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleSelectOccasion(occ.slug)}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      isSelected
                        ? 'bg-brand-orange text-white shadow-orange'
                        : 'bg-gray-100 text-gray-800 hover:bg-brand-orange hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ Viewing Flowers' : 'Shop ' + occ.name + ' Flowers'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── FILTERED OCCASION PRODUCTS SECTION ── */}
      {activeOccasionSlug && (
        <section id="occasion-product-grid" className="py-14 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-brand-orange">
                  Curated Collection
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {selectedOccasionData?.name || activeOccasionSlug} Flowers & Gifts
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOccasionData?.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/shop?occasion=${activeOccasionSlug}`}
                  className="btn-orange !py-2.5 !px-5 text-xs flex items-center gap-2"
                >
                  View in Full Shop <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setSearchParams({})}
                  className="px-4 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Clear Occasion Filter
                </button>
              </div>
            </div>

            {loadingProducts ? (
              <ProductSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="bg-gray-50 rounded-3xl p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-brand-orange-pale text-brand-orange flex items-center justify-center mx-auto mb-4">
                  <Flower2 size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No flowers found for {selectedOccasionData?.name || activeOccasionSlug}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Check out our complete collection in the shop for all available arrangements.
                </p>
                <Link to="/shop" className="btn-orange">
                  Explore All Flowers
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TRUST & VALUE BADGES BANNER ── */}
      <section className="py-14 bg-brand-cream border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: 'Freshness Guaranteed', desc: '100% farm-fresh Ethiopian blooms' },
              { icon: Award, title: 'Artisan Florists', desc: 'Hand-crafted by experienced stylists' },
              { icon: Gift, title: 'Free Message Card', desc: 'Included with every occasion order' },
              { icon: Sun, title: 'Same-Day Delivery', desc: 'Order before 1:00 PM for fast arrival' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-soft flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-orange-pale flex items-center justify-center text-brand-orange mb-3">
                  <Icon size={22} />
                </div>
                <h4 className="font-bold text-gray-800 text-base">{title}</h4>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
