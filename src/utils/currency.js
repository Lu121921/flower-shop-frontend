/**
 * Utility function to format price numbers into Ethiopian Birr currency string.
 * Examples:
 *   formatPrice(2500) => "2,500 ETB"
 *   formatPrice(12500.5) => "12,500.50 ETB"
 */
export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ETB'
  }
  const num = Number(amount)
  // Format with integer or 2 decimal places if non-zero decimals
  const formatted = num % 1 === 0 
    ? num.toLocaleString('en-US') 
    : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  return `${formatted} ETB`
}

export function formatPriceShort(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ETB'
  }
  const num = Number(amount)
  return `${num.toLocaleString('en-US')} ETB`
}
