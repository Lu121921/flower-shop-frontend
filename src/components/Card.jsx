import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = true,
  padding = true,
  onClick,
}) => {
  const baseClasses = `card-luxury ${padding ? 'p-6' : ''} ${className}`

  if (onClick) {
    return (
      <motion.div
        className={`${baseClasses} cursor-pointer`}
        onClick={onClick}
        whileHover={hover ? { y: -5 } : {}}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={baseClasses}
      whileHover={hover ? { y: -5 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default Card
