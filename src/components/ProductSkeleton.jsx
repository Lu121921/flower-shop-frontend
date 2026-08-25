export default function ProductSkeleton({ count = 8, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="product-card flex gap-4 p-4">
            <div className="skeleton w-32 h-32 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-5 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-card overflow-hidden">
          <div className="skeleton aspect-square" />
          <div className="p-4 space-y-2">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-5 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
