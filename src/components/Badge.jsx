const variants = {
  orange:  'bg-brand-orange-pale text-brand-orange border border-brand-orange/20',
  green:   'bg-brand-green-pale text-brand-green border border-brand-green/20',
  gray:    'bg-gray-100 text-gray-600 border border-gray-200',
  red:     'bg-red-50 text-red-600 border border-red-200',
  yellow:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
  blue:    'bg-blue-50 text-blue-600 border border-blue-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
}

const Badge = ({ children, variant = 'orange', size = 'md', className = '', dot }) => (
  <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'orange' ? 'bg-brand-orange' : variant === 'green' ? 'bg-brand-green' : variant === 'red' ? 'bg-red-500' : variant === 'success' ? 'bg-green-500' : 'bg-current'}`} />}
    {children}
  </span>
)

export default Badge
