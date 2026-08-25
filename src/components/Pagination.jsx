import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ page, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const delta = 2
    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)

    pages.push(1)
    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
              p === page
                ? 'bg-brand-orange text-white shadow-orange'
                : 'border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default Pagination
