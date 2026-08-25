import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, ArrowRight, Star, Minus, Plus, X } from 'lucide-react'
import Modal from './Modal'
import Rating from './Rating'
import Badge from './Badge'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { formatPrice } from '../utils/currency'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80'

export default function QuickView({ product, isOpen, onClose }) {
  const [qty, setQty] = useState(1)
  const [imgError, setImgError] = useState(false)
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (!product) return null

  const inCart  = isInCart(product.id)
  const inWish  = isInWishlist(product.id)
  const images  = product.product_images?.length
    ? product.product_images
    : [{ url: product.image_url || PLACEHOLDER, alt_text: product.name }]
  const [activeImg, setActiveImg] = useState(0)

  const handleAdd = () => {
    addToCart(product, qty)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Images */}
        <div className="bg-gray-50 p-4 sm:p-6 flex flex-col gap-3">
          <div className="aspect-square max-h-60 sm:max-h-none rounded-xl overflow-hidden bg-white mx-auto w-full">
            <img
              src={imgError ? PLACEHOLDER : (images[activeImg]?.url || PLACEHOLDER)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === activeImg ? 'border-brand-orange' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
          {product.categories?.name && (
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">{product.categories.name}</span>
          )}
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h2>

          {product.avg_rating > 0 && (
            <div className="flex items-center gap-2">
              <Rating value={product.avg_rating} size={14} />
              <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compare_price > product.price && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>

          {product.short_desc && <p className="text-sm text-gray-600 leading-relaxed">{product.short_desc}</p>}

          {product.stock === 0 ? (
            <Badge variant="gray">Out of Stock</Badge>
          ) : (
            <Badge variant="success" dot>In Stock{product.stock <= 5 ? ` — Only ${product.stock} left` : ''}</Badge>
          )}

          {/* Qty */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Qty:</span>
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-bold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 btn-orange justify-center ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ShoppingBag size={16} />
              {inCart ? 'Add More' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${inWish ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
            >
              <Heart size={18} className={inWish ? 'fill-red-500' : ''} />
            </button>
          </div>

          <Link
            to={`/shop/${product.id}`}
            onClick={onClose}
            className="flex items-center justify-center gap-1 text-sm font-semibold text-brand-orange hover:gap-2 transition-all"
          >
            View Full Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Modal>
  )
}
