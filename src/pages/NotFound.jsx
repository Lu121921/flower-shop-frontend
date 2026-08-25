import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flower2, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-brand-orange-pale flex items-center justify-center mx-auto mb-6">
          <Flower2 size={40} className="text-brand-orange animate-float" />
        </div>
        <h1 className="text-8xl font-extrabold text-brand-orange mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">The page you're looking for seems to have wilted away. Let's get you back on track.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-orange"><Home size={16} /> Go Home</Link>
          <Link to="/shop" className="inline-flex items-center gap-2 border-2 border-brand-orange text-brand-orange font-semibold px-6 py-3 rounded-full hover:bg-brand-orange-pale transition-colors text-sm">
            <ShoppingBag size={16} /> Shop Flowers
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
