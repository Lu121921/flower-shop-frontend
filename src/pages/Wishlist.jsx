import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import EmptyState from '../components/EmptyState'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80'

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart, isInCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <EmptyState icon={Heart} title="Your wishlist is empty" description="Save your favourite flowers here so you never lose track of what you love." actionHref="/shop" actionLabel="Explore Flowers" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader title={`My Wishlist (${items.length})`} className="mb-0" />
          <button onClick={clearWishlist} className="text-sm text-red-400 hover:text-red-600 font-semibold flex items-center gap-1.5">
            <Trash2 size={14} /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {items.map(product => (
              <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="product-card group overflow-hidden">
                <Link to={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                  <img src={product.image_url || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = PLACEHOLDER }} />
                  <button onClick={e => { e.preventDefault(); removeFromWishlist(product.id) }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={15} />
                  </button>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="gray">Out of Stock</Badge>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  {product.categories?.name && <p className="text-xs font-bold text-brand-orange uppercase tracking-wide mb-1">{product.categories.name}</p>}
                  <Link to={`/shop/${product.id}`} className="font-bold text-sm text-gray-800 hover:text-brand-orange transition-colors line-clamp-2">{product.name}</Link>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock === 0 || isInCart(product.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isInCart(product.id) ? 'bg-brand-green text-white' : product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-orange text-white hover:bg-brand-orange-dark'}`}
                    >
                      <ShoppingBag size={13} />
                      {isInCart(product.id) ? 'In Cart' : 'Add'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:gap-3 transition-all">
            Continue Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
