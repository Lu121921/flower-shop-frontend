import { Star } from 'lucide-react'

const Rating = ({ value = 0, max = 5, size = 16, interactive = false, onChange, showValue = false, count }) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onChange ? () => onChange(star) : undefined}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          <Star
            size={size}
            className={star <= value ? 'text-yellow-400 fill-yellow-400' : star - 0.5 <= value ? 'text-yellow-400 fill-yellow-200' : 'text-gray-300 fill-gray-100'}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {Number(value).toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-0.5">({count})</span>
      )}
    </div>
  )
}

export default Rating
