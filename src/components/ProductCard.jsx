import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import Badge from './Badge'
import OptimizedImage from './OptimizedImage'
import { formatPrice } from '../utils/currency'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80'

export default function ProductCard({ product, onQuickView, viewMode = 'grid' }) {
  const [imgError, setImgError] = useState(false)
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (!product) return null

  const inCart    = isInCart(product.id)
  const inWish    = isInWishlist(product.id)
  const discount  = product.compare_price && product.compare_price > product.price
    ? Math.round((1 - product.price / product.compare_price) * 100) : 0
  const outOfStock = product.stock === 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!outOfStock) addToCart(product, 1)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) onQuickView(product)
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="product-card flex gap-3 sm:gap-4 p-3 sm:p-4"
      >
        <Link to={`/shop/${product.id}`} className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100">
          <OptimizedImage
            src={imgError ? PLACEHOLDER : (product.image_url || PLACEHOLDER)}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            {product.categories?.name && (
              <p className="text-xs font-semibold text-brand-orange uppercase tracking-wide mb-1">{product.categories.name}</p>
            )}
            <Link to={`/shop/${product.id}`}>
              <h3 className="font-bold text-gray-800 hover:text-brand-orange transition-colors line-clamp-2">{product.name}</h3>
            </Link>
            {product.short_desc && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_desc}</p>}
            {product.avg_rating > 0 && (
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{Number(product.avg_rating).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.review_count})</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.compare_price > product.price && (
                <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.compare_price)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || inCart}
              className={`btn-orange !py-2 !px-4 text-xs ${(outOfStock || inCart) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {outOfStock ? 'Out of Stock' : inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="product-card group relative"
    >
      {/* Image container */}
      <Link to={`/shop/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-100">
        <OptimizedImage
          src={imgError ? PLACEHOLDER : (product.image_url || PLACEHOLDER)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outOfStock && <Badge variant="gray" size="sm">Out of Stock</Badge>}
          {!outOfStock && product.featured && <Badge variant="orange" size="sm">Featured</Badge>}
          {discount > 0 && !outOfStock && <Badge variant="red" size="sm">-{discount}%</Badge>}
          {!outOfStock && product.stock <= 5 && product.stock > 0 && (
            <Badge variant="yellow" size="sm">Only {product.stock} left</Badge>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleToggleWishlist}
            className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"
            aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} className={inWish ? 'fill-red-500 text-red-500' : ''} />
          </button>
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </button>
          )}
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || inCart}
            className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors
              ${outOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : inCart ? 'bg-brand-green text-white'
                : 'bg-brand-orange text-white hover:bg-brand-orange-dark'}`}
          >
            <ShoppingBag size={15} />
            {outOfStock ? 'Out of Stock' : inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.categories?.name && (
          <p className="text-xs font-semibold text-brand-orange uppercase tracking-wide mb-1">{product.categories.name}</p>
        )}
        <Link to={`/shop/${product.id}`}>
          <h3 className="font-bold text-gray-800 text-sm hover:text-brand-orange transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-gray-700">{Number(product.avg_rating).toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100/60">
          <div>
            <span className="font-bold text-gray-900 text-sm sm:text-base">{formatPrice(product.price)}</span>
            {product.compare_price > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={handleToggleWishlist}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={15} className={inWish ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || inCart}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
                outOfStock ? 'bg-gray-300 cursor-not-allowed'
                : inCart ? 'bg-brand-green'
                : 'bg-brand-orange hover:bg-brand-orange-dark'
              }`}
              aria-label={outOfStock ? 'Out of Stock' : inCart ? 'In Cart' : 'Add to Cart'}
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
