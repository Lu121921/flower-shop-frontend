import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  fullWidth = false,
}) => {
  const baseClasses =
    'font-semibold rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-orange hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    gold: 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-orange hover:shadow-lg',
    outline: 'border-2 border-brand-orange text-brand-orange hover:bg-brand-orange-pale',
    ghost: 'text-brand-orange hover:bg-brand-orange-pale',
    white: 'bg-white hover:bg-gray-50 text-brand-orange shadow-card',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = `${baseClasses} ${variants[variant] ?? variants.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}

export default Button
