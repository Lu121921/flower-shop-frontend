import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = ({ items = [] }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
    <Link to="/" className="hover:text-brand-orange transition-colors flex items-center gap-1">
      <Home size={14} />
    </Link>
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
        {item.href && i < items.length - 1 ? (
          <Link to={item.href} className="hover:text-brand-orange transition-colors">{item.label}</Link>
        ) : (
          <span className={i === items.length - 1 ? 'text-gray-800 font-semibold' : ''}>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
)

export default Breadcrumb
