import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Share2, Star, Minus, Plus, ChevronRight, Truck, Shield, RefreshCw, Award } from 'lucide-react'
import { productAPI, reviewAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import Breadcrumb from '../components/Breadcrumb'
import Rating from '../components/Rating'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/currency'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct]       = useState(null)
  const [related, setRelated]       = useState([])
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeImg, setActiveImg]   = useState(0)
  const [qty, setQty]               = useState(1)
  const [activeTab, setActiveTab]   = useState('description')
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)

  const { addToCart, isInCart }       = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addProduct, items: recentItems } = useRecentlyViewed()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const fetch = async () => {
      setLoading(true)
      try {
        const r = await productAPI.getById(id)
        const p = r.data?.product
        setProduct(p)
        addProduct(p)
        if (p?.categories?.id) {
          const rel = await productAPI.getAll({ category_id: p.categories.id, limit: 5 })
          setRelated((rel.data?.products || []).filter(x => x.id !== id).slice(0, 4))
        }
        const rev = await reviewAPI.getByProduct(id, { limit: 10 })
        setReviews(rev.data?.reviews || [])
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  if (loading) return <Loading size="lg" text="Loading product…" />
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold text-gray-700">Product not found</p>
      <Link to="/shop" className="btn-orange">Back to Shop</Link>
    </div>
  )

  const images = product.product_images?.length
    ? product.product_images : [{ url: product.image_url || PLACEHOLDER, alt_text: product.name }]
  const inCart = isInCart(product.id)
  const inWish = isInWishlist(product.id)
  const discount = product.compare_price > product.price
    ? Math.round((1 - product.price / product.compare_price) * 100) : 0

  const handleAddToCart = () => {
    if (product.stock === 0) return
    addToCart(product, qty)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await reviewAPI.create({ product_id: id, ...reviewForm })
      const rev = await reviewAPI.getByProduct(id, { limit: 10 })
      setReviews(rev.data?.reviews || [])
      setReviewForm({ rating: 5, title: '', body: '' })
      toast.success('Review submitted!')
    } catch { /* handled by axios */ }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
        <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: product.categories?.name || 'Products', href: `/shop?category=${product.categories?.slug}` }, { label: product.name }]} />

        <div className="grid lg:grid-cols-2 gap-12 mt-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl overflow-hidden bg-gray-50 aspect-square">
              <img src={images[activeImg]?.url || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-18 h-18 min-w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-brand-orange' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {product.categories?.name && <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">{product.categories.name}</span>}
              {product.tags?.find(t => t.startsWith('flower_type:')) && (
                <span className="bg-brand-green-pale text-brand-green text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {product.tags.find(t => t.startsWith('flower_type:')).replace('flower_type:', '')}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

            {/* Occasions badges */}
            {product.tags?.some(t => t.startsWith('occasion:')) && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-gray-400">Occasions:</span>
                {product.tags.filter(t => t.startsWith('occasion:')).map(t => (
                  <Link
                    key={t}
                    to={`/occasions?occasion=${t.replace('occasion:', '')}`}
                    className="bg-brand-orange-pale text-brand-orange hover:bg-brand-orange hover:text-white transition-colors text-xs font-bold px-2.5 py-1 rounded-full"
                  >
                    {t.replace('occasion:', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {product.avg_rating > 0 && (
                <div className="flex items-center gap-2">
                  <Rating value={product.avg_rating} size={15} />
                  <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
                </div>
              )}
              {discount > 0 && <Badge variant="red">-{discount}%</Badge>}
              {product.stock === 0 ? <Badge variant="gray">Out of Stock</Badge>
                : product.stock <= 5 ? <Badge variant="yellow" dot>Only {product.stock} left</Badge>
                : <Badge variant="success" dot>In Stock</Badge>}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
              {product.compare_price > product.price && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
              )}
            </div>

            {product.short_desc && <p className="text-gray-600 leading-relaxed">{product.short_desc}</p>}

            {/* Qty + Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"><Minus size={15} /></button>
                  <span className="w-10 text-center font-bold text-base">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"><Plus size={15} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleWishlist(product)} className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${inWish ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'}`} aria-label="Wishlist">
                    <Heart size={18} className={inWish ? 'fill-red-500' : ''} />
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }} className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-colors" aria-label="Share">
                    <Share2 size={17} />
                  </button>
                </div>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className={`flex-1 btn-orange justify-center py-3 text-base ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ShoppingBag size={18} /> {inCart ? 'Add More' : 'Add to Cart'}
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              {[{ icon: Truck, text: 'Free delivery on orders over 5,000 ETB' }, { icon: Shield, text: '100% satisfaction guaranteed' }, { icon: RefreshCw, text: 'Easy returns within 24 hours' }, { icon: Award, text: 'Expert florists, premium flowers' }].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon size={16} className="text-brand-orange flex-shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
            {[['description', 'Description'], ['reviews', `Reviews (${reviews.length})`], ['details', 'Details']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`px-5 sm:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap -mb-px ${activeTab === key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{label}</button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {reviews.length === 0 ? <p className="text-gray-500">No reviews yet. Be the first!</p> : (
                reviews.map((rev, i) => (
                  <div key={i} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold flex-shrink-0">
                      {(rev.profiles?.full_name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-800">{rev.profiles?.full_name || 'Customer'}</span>
                        {rev.is_verified && <Badge variant="success" size="sm">Verified Purchase</Badge>}
                        <span className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                      <Rating value={rev.rating} size={13} />
                      {rev.title && <p className="font-semibold text-gray-800 mt-2">{rev.title}</p>}
                      {rev.body && <p className="text-gray-600 text-sm mt-1 leading-relaxed">{rev.body}</p>}
                    </div>
                  </div>
                ))
              )}

              {/* Review form */}
              <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-2xl p-6 space-y-4 mt-6">
                <h3 className="font-bold text-lg text-gray-800">Write a Review</h3>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Rating</label>
                  <Rating value={reviewForm.rating} size={24} interactive onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                </div>
                <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title (optional)" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} placeholder="Share your experience…" rows={4} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
                <button type="submit" disabled={submitting} className="btn-orange">{submitting ? 'Submitting…' : 'Submit Review'}</button>
              </form>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ['SKU', product.sku || 'N/A'],
                ['Category', product.categories?.name || 'N/A'],
                ['Flower Type', product.tags?.find(t => t.startsWith('flower_type:'))?.replace('flower_type:', '') || product.tags?.find(t => ['rose','sunflower','tulip','lavender','lily','peony','orchid','hydrangea'].includes(t.toLowerCase())) || 'Fresh Cut Flowers'],
                ['Relevant Occasions', product.tags?.filter(t => t.startsWith('occasion:')).map(t => t.replace('occasion:', '').replace(/_/g, ' ')).join(', ') || 'Anniversary, Birthday, Celebration'],
                ['Stock', product.stock > 0 ? `${product.stock} units available` : 'Out of stock'],
                ['Availability', product.stock > 0 ? 'In Stock' : 'Unavailable'],
                ['Weight', product.weight_grams ? `${product.weight_grams}g` : 'N/A'],
                ['Tags', product.tags?.join(', ') || 'N/A']
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 w-36 flex-shrink-0">{k}</span>
                  <span className="text-gray-600 capitalize">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentItems.filter(i => i.id !== id).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recentItems.filter(i => i.id !== id).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Buy Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium">Price</p>
          <p className="text-lg font-extrabold text-gray-900 leading-tight">{formatPrice(product.price * qty)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`btn-orange !py-2.5 !px-5 text-xs font-bold ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ShoppingBag size={16} /> {inCart ? 'Add More' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
