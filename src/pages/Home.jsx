import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Truck, Flower2, Shield, Award, Gift,
  Heart, Sparkles, Baby, ChevronLeft, ChevronRight,
  Star, Instagram, Quote, Layers
} from 'lucide-react'
import { productAPI, contactAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import SectionHeader from '../components/SectionHeader'
import QuickView from '../components/QuickView'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

const HERO_SLIDES = [
  {
    title: 'BIGGER.\nBRIGHTER.\nBETTER.',
    titleHighlight: 'BRIGHTER.',
    subtitle: 'Fresh flowers and thoughtful gifts that celebrate life, nature and every meaningful moment.',
    cta: 'Shop Flowers',
    ctaHref: '/shop',
    img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=900&q=80',
    bg: 'from-orange-50 to-amber-50',
  },
  {
    title: 'LOVE IN\nEVERY\nPETAL.',
    titleHighlight: 'EVERY',
    subtitle: 'Hand-crafted bouquets for your most cherished moments. Same-day delivery available.',
    cta: 'Explore Bouquets',
    ctaHref: '/shop?category=bouquets',
    img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=900&q=80',
    bg: 'from-rose-50 to-pink-50',
  },
  {
    title: 'GIFTS THAT\nSPEAK\nLOUDER.',
    titleHighlight: 'SPEAK',
    subtitle: 'Curated gift hampers and hat boxes to make every occasion extraordinary.',
    cta: 'View Gift Sets',
    ctaHref: '/shop?category=gift-hampers',
    img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&q=80',
    bg: 'from-green-50 to-emerald-50',
  },
]

const TRUST_BADGES = [
  { icon: Truck,   title: 'Same Day Delivery', subtitle: 'Order before 1PM' },
  { icon: Flower2, title: 'Fresh From Our Farms', subtitle: 'Sustainably sourced' },
  { icon: Award,   title: 'Expert Florists', subtitle: 'Crafted by professionals' },
  { icon: Shield,  title: 'Happiness Guaranteed', subtitle: 'Your satisfaction, always' },
]

const COLLECTIONS = [
  { name: 'Bouquets',     slug: 'bouquets',     price: 'From 3,200 ETB', bg: 'bg-orange-50', img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80' },
  { name: 'Hat Boxes',    slug: 'hat-boxes',    price: 'From 8,500 ETB', bg: 'bg-rose-50',   img: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=500&q=80' },
  { name: 'Plants',       slug: 'plants',       price: 'From 2,800 ETB', bg: 'bg-green-50',  img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80' },
  { name: 'Gift Hampers', slug: 'gift-hampers', price: 'From 6,800 ETB', bg: 'bg-yellow-50', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80' },
]

const OCCASIONS = [
  { name: 'Birthday',        icon: Gift,     slug: 'birthday' },
  { name: 'Anniversary',     icon: Heart,    slug: 'anniversary' },
  { name: "Valentine's",     icon: Heart,    slug: 'valentines' },
  { name: 'Wedding',         icon: Sparkles, slug: 'wedding' },
  { name: 'Engagement',      icon: Sparkles, slug: 'engagement' },
  { name: 'Graduation',      icon: Award,    slug: 'graduation' },
  { name: "Mother's Day",    icon: Flower2,  slug: 'mothers_day' },
  { name: "Father's Day",    icon: Shield,   slug: 'fathers_day' },
  { name: 'Thank You',       icon: Flower2,  slug: 'thank_you' },
  { name: 'Congratulations', icon: Sparkles, slug: 'congratulations' },
  { name: 'Get Well Soon',   icon: Heart,    slug: 'get_well' },
  { name: 'New Baby',        icon: Baby,     slug: 'new_baby' },
  { name: 'Apology',         icon: Flower2,  slug: 'apology' },
  { name: 'Love & Romance',  icon: Heart,    slug: 'love_romance' },
  { name: 'Friendship',      icon: Heart,    slug: 'friendship' },
  { name: 'Sympathy',        icon: Heart,    slug: 'sympathy' },
  { name: 'Celebration',     icon: Gift,     slug: 'celebration' },
  { name: 'Just Because',    icon: Flower2,  slug: 'just_because' },
]

const REVIEWS = [
  { name: 'Sarah M.', rating: 5, text: 'Absolutely stunning arrangement! The flowers were fresh and beautifully presented. Will definitely order again.', date: '2 days ago', avatar: 'S' },
  { name: 'James K.', rating: 5, text: 'Ordered for my wife\'s birthday and she was speechless. Same-day delivery worked perfectly. Amazing quality!', date: '1 week ago', avatar: 'J' },
  { name: 'Emma L.', rating: 5, text: 'The hat box arrangement was gorgeous. Great packaging and the flowers lasted over two weeks!', date: '2 weeks ago', avatar: 'E' },
]

const INSTA = [
  'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&q=80',
  'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
  'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&q=80',
  'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300&q=80',
  'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=300&q=80',
]

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [featured, setFeatured] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featRes, allRes] = await Promise.allSettled([
          productAPI.getFeatured(8),
          productAPI.getAll({ limit: 16, sort_by: 'created_at', order: 'desc' }),
        ])
        if (featRes.status === 'fulfilled') setFeatured(featRes.value.data?.products || [])
        if (allRes.status === 'fulfilled') {
          const products = allRes.value.data?.products || []
          setBestsellers(products.filter(p => p.avg_rating >= 4).slice(0, 5))
          setNewArrivals(products.slice(0, 8))
        }
      } catch (e) { /* silent */ }
      finally { setLoadingProducts(false) }
    }
    fetchAll()
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await contactAPI.subscribe({ email })
      setEmail('')
    } catch { /* toast handled by axios interceptor */ }
  }

  const slide = HERO_SLIDES[heroIdx]

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} min-h-[520px] md:min-h-[580px]`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center"
          >
            <div className="space-y-6 order-2 md:order-1">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none text-gray-800">
                {slide.title.split('\n').map((line, i) => (
                  <span key={i} className={`block ${line === slide.titleHighlight ? 'text-brand-orange' : ''}`}>{line}</span>
                ))}
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-md leading-relaxed">{slide.subtitle}</p>
              <div className="flex gap-4 flex-wrap">
                <Link to={slide.ctaHref} className="btn-orange">
                  {slide.cta} <ArrowRight size={16} />
                </Link>
                <Link to="/flower-meanings" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors">
                  Flower Meanings <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square max-w-md mx-auto">
                <img src={slide.img} alt="Hero" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-xl px-4 py-2 shadow-card">
                <span className="font-bold text-brand-green text-lg" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>Luna Bloom's</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} className={`transition-all duration-300 rounded-full ${i === heroIdx ? 'w-6 h-2.5 bg-brand-orange' : 'w-2.5 h-2.5 bg-gray-300'}`} />
          ))}
        </div>
        <button onClick={() => setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"><ChevronLeft size={18} /></button>
        <button onClick={() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"><ChevronRight size={18} /></button>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="bg-white py-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, title, subtitle }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-orange-pale flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-orange" />
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-800 leading-tight">{title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Shop Our Collections" viewAllHref="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {COLLECTIONS.map((col, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/shop?category=${col.slug}`} className="block group product-card overflow-hidden">
                  <div className={`relative overflow-hidden aspect-square ${col.bg}`}>
                    <img src={col.img} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-800">{col.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{col.price}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="More ways to shop"
            subtitle="Create custom bouquets, explore gift bundles and get a personalised recommendation instantly."
          />
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            <Link to="/recommendations" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-soft hover:border-brand-orange transition-colors">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-brand-orange-pale text-brand-orange mb-5">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalised Picks</h3>
              <p className="text-sm text-gray-500">Answer a short wizard and get handpicked bouquets for your occasion.</p>
            </Link>

            <Link to="/bouquet-builder" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-soft hover:border-brand-orange transition-colors">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-brand-green-pale text-brand-green mb-5">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bouquet Builder</h3>
              <p className="text-sm text-gray-500">Design your own bouquet by choosing size, wrapping, blooms and extras.</p>
            </Link>

            <Link to="/gift-bundles" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-soft hover:border-brand-orange transition-colors">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-brand-orange-pale text-brand-orange mb-5">
                <Gift size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gift Bundles</h3>
              <p className="text-sm text-gray-500">Browse curated gift sets that include flowers, treats and premium extras.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STORY BANNER ── */}
      <section className="bg-brand-orange py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5 text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">FLOWERS THAT TELL<br />BEAUTIFUL STORIES</h2>
              <p className="text-white/90 text-base leading-relaxed max-w-md">We source the finest blooms and design with heart to bring beauty, joy and meaning to every moment.</p>
              <Link to="/about" className="inline-flex items-center gap-2 bg-white text-brand-orange font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-all text-sm">
                OUR STORY <ArrowRight size={15} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3">
              {['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80','https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&q=80','https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80','https://images.unsplash.com/photo-1495231916356-a86217efff12?w=400&q=80'].map((src, i) => (
                <img key={i} src={src} alt="" className={`rounded-2xl shadow-lg w-full object-cover ${i % 2 === 0 ? 'h-48' : 'h-56'} ${i % 2 !== 0 ? 'mt-4' : ''}`} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OCCASIONS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Shop by Occasion" viewAllHref="/occasions" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {OCCASIONS.map(({ name, icon: Icon, slug }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link to={`/occasions?occasion=${slug}`} className="flex flex-col items-center gap-2.5 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white transition-all duration-200 group-hover:border-brand-orange group-hover:bg-brand-orange-pale">
                    <Icon size={26} className="text-brand-orange" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-wide leading-tight">{name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Featured Flowers" subtitle="Hand-picked by our expert florists" viewAllHref="/shop?featured=true" />
          {loadingProducts ? <ProductSkeleton count={8} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(featured.length ? featured : newArrivals).slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-12 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 md:p-10 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">10% OFF YOUR FIRST ORDER</h3>
              <p className="text-gray-500 text-sm">Join our community and enjoy your first order discount.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 md:w-64 px-4 py-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange" required />
              <button type="submit" className="btn-orange whitespace-nowrap">SUBSCRIBE</button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Best Sellers" subtitle="Our most loved arrangements" viewAllHref="/shop?sort=popular" />
          {loadingProducts ? <ProductSkeleton count={5} /> : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {(bestsellers.length ? bestsellers : newArrivals).slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="New Arrivals" subtitle="Fresh blooms, just in" viewAllHref="/shop?sort=newest" />
          {loadingProducts ? <ProductSkeleton count={4} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {newArrivals.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-16 bg-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="What Our Customers Say" className="[&_h2]:text-white [&_p]:text-white/80" />
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-card">
                <Quote size={24} className="text-brand-orange mb-3 opacity-40" />
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm">{r.avatar}</div>
                  <div>
                    <div className="font-bold text-sm text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Follow Our Bloom Journey" subtitle="@lunablooms — Tag us to be featured" center />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {INSTA.map((src, i) => (
              <motion.a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="block aspect-square overflow-hidden rounded-xl group relative">
                <img src={src} alt="Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={24} className="text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <QuickView product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}
