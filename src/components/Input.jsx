import { forwardRef, useId } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const Input = forwardRef(({
  label,
  error,
  hint,
  type = 'text',
  icon: Icon,
  className = '',
  inputClassName = '',
  required,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const generatedId = useId()
  const inputId = props.id || generatedId
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={17} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`
            w-full px-4 py-3 text-sm border rounded-xl bg-white
            transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10'
            }
            placeholder:text-gray-400 text-gray-800
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${inputClassName}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
