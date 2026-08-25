import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const SectionHeader = ({ title, subtitle, viewAllHref, viewAllLabel = 'View All', center = false, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 ${className}`}
  >
    <div className={center ? 'text-center w-full' : ''}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-gray-500 max-w-md">{subtitle}</p>}
    </div>
    {viewAllHref && !center && (
      <Link
        to={viewAllHref}
        className="flex items-center gap-1 text-brand-orange font-semibold text-sm hover:gap-2 transition-all whitespace-nowrap flex-shrink-0"
      >
        {viewAllLabel} <ArrowRight size={15} />
      </Link>
    )}
  </motion.div>
)

export default SectionHeader
