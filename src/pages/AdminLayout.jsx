import { NavLink, Outlet } from 'react-router-dom'
import { Home, Box, Layers, ShoppingBag, Users, Star, CreditCard, Mail, BarChart3, FileText, Settings, Sparkles, Leaf, Gift } from 'lucide-react'

const sections = [
  { label: 'Overview', to: '/admin', icon: Home },
  { label: 'Products', to: '/admin/products', icon: Box },
  { label: 'Categories', to: '/admin/categories', icon: Layers },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Inventory', to: '/admin/inventory', icon: Sparkles },
  { label: 'Payments', to: '/admin/payments', icon: CreditCard },
  { label: 'Subscribers', to: '/admin/newsletter', icon: Mail },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', to: '/admin/reports', icon: FileText },
  { label: 'Gift Bundles', to: '/admin/gift-bundles', icon: Gift },
  { label: 'Rules', to: '/admin/recommendation-rules', icon: Sparkles },
  { label: 'Meanings', to: '/admin/flower-meanings', icon: Leaf },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile Admin Nav Horizontal Scrollbar */}
        <div className="xl:hidden bg-white rounded-2xl p-4 shadow-soft mb-6 border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-2">Admin Console Navigation</p>
          <nav className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {sections.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? 'bg-brand-orange text-white shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-brand-orange-pale'}`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="grid xl:grid-cols-[300px_1fr] gap-8">
          <aside className="hidden xl:block rounded-3xl border border-gray-100 bg-white p-6 shadow-soft h-fit sticky top-24">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-orange">Admin Console</p>
              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">Luna Bloom HQ</h2>
              <p className="mt-2 text-sm text-gray-500">Quick access to store operations, inventory, reports, and marketing tools.</p>
            </div>
            <nav className="space-y-1">
              {sections.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-brand-orange text-white shadow-soft' : 'text-gray-700 hover:bg-brand-orange-pale hover:text-brand-orange'}`
                  }
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <Icon size={18} />
                  </span>
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <section className="space-y-6 min-w-0 overflow-x-auto">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}
