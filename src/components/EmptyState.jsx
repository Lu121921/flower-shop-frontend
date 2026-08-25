import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const EmptyState = ({ icon: Icon, title, description, action, actionLabel, actionHref }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center px-4"
  >
    {Icon && (
      <div className="w-20 h-20 rounded-full bg-brand-orange-pale flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-brand-orange" />
      </div>
    )}
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
    {action && (
      <button
        onClick={action}
        className="btn-orange"
      >
        {actionLabel}
      </button>
    )}
    {actionHref && !action && (
      <Link to={actionHref} className="btn-orange">{actionLabel}</Link>
    )}
  </motion.div>
)

export default EmptyState
