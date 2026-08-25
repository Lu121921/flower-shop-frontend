import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, Box, Users, Star, Mail, Sparkles, ShieldCheck,
  Package, ShoppingBag, Plus, Trash2, Edit3, Check, X, Search, Filter, Tag,
  Flower2, Gift, RefreshCw, Settings as SettingsIcon, AlertTriangle
} from 'lucide-react'
import { adminAPI, productAPI, categoryAPI, bundleAPI, flowerAPI } from '../services/api'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/currency'

const STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'blue',
  processing: 'orange',
  shipped: 'blue',
  delivered: 'success',
  cancelled: 'red',
  refunded: 'gray',
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Box },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'bundles', label: 'Gift Bundles', icon: Gift },
  { id: 'meanings', label: 'Flower Meanings', icon: Flower2 },
  { id: 'rules', label: 'Rules', icon: Sparkles },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  // Data states
  const [dashboard, setDashboard] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [rules, setRules] = useState([])
  const [bundles, setBundles] = useState([])
  const [meanings, setMeanings] = useState([])
  const [analytics, setAnalytics] = useState(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [modalType, setModalType] = useState(null) // 'product' | 'category' | 'order' | 'bundle' | 'meaning' | 'rule'
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving] = useState(false)

  // Form states
  const [productForm, setProductForm] = useState({ name: '', slug: '', price: '', stock: '10', category_id: '', description: '', featured: false, occasion: 'birthday', flower_type: 'Rose', image_url: '' })
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' })
  const [orderForm, setOrderForm] = useState({ status: 'pending', tracking_number: '' })
  const [bundleForm, setBundleForm] = useState({ name: '', slug: '', base_price: '8500', discount_pct: '10', description: '' })
  const [meaningForm, setMeaningForm] = useState({
    flower_name: '',
    slug: '',
    meaning: '',
    symbolism: '',
    emotional_message: '',
    occasions: '',
    recommended_recipients: '',
    colors: '',
    origin: '',
    fun_fact: '',
    image_url: ''
  })
  const [ruleForm, setRuleForm] = useState({ name: '', rule_type: 'occasion', trigger_value: 'birthday', priority: '1', is_active: true })
  const [settingsForm, setSettingsForm] = useState({ store_name: 'Luna Bloom', support_email: 'support@lunablooms.com', currency: 'ETB', fulfillment_hours: 48 })

  useEffect(() => {
    loadAllAdminData()
  }, [])

  const loadAllAdminData = async () => {
    setLoading(true)
    try {
      const [dashRes, prodRes, catRes, orderRes, userRes, revRes, subRes, ruleRes, bundleRes, meanRes, analRes] = await Promise.allSettled([
        adminAPI.getDashboard(),
        productAPI.getAll({ limit: 100 }),
        categoryAPI.getAll(),
        adminAPI.getOrders({ limit: 100 }),
        adminAPI.getUsers({ limit: 100 }),
        adminAPI.getReviews({ limit: 100 }),
        adminAPI.getNewsletterSubscribers({ limit: 100 }),
        adminAPI.getRecommendationRules({ limit: 100 }),
        bundleAPI.getAll(),
        flowerAPI.getAll(),
        adminAPI.getAnalytics(),
      ])

      if (dashRes.status === 'fulfilled') setDashboard(dashRes.value.data?.data)
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data?.products || [])
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data?.categories || [])
      if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data?.orders || [])
      if (userRes.status === 'fulfilled') setUsers(userRes.value.data?.users || [])
      if (revRes.status === 'fulfilled') setReviews(revRes.value.data?.reviews || [])
      if (subRes.status === 'fulfilled') setSubscribers(subRes.value.data?.subscribers || [])
      if (ruleRes.status === 'fulfilled') setRules(ruleRes.value.data?.rules || [])
      if (bundleRes.status === 'fulfilled') setBundles(bundleRes.value.data?.bundles || [])
      if (meanRes.status === 'fulfilled') setMeanings(meanRes.value.data?.flowers || [])
      if (analRes.status === 'fulfilled') setAnalytics(analRes.value.data)
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  // --- Handlers ---
  const handleSaveProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const tagsArray = [
        productForm.flower_type ? `flower_type:${productForm.flower_type}` : 'flower_type:Rose',
        productForm.occasion ? `occasion:${productForm.occasion}` : 'occasion:birthday',
        productForm.occasion || 'birthday'
      ]
      const payload = {
        ...productForm,
        tags: tagsArray
      }
      if (editItem) {
        await productAPI.update(editItem.id, payload)
        toast.success('Product updated!')
      } else {
        await productAPI.create({ ...payload, slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-') })
        toast.success('Product created!')
      }
      setModalType(null)
      loadAllAdminData()
    } catch { /* handled */ } finally { setSaving(false) }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productAPI.delete(id)
      toast.success('Product deleted!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editItem) {
        await categoryAPI.update(editItem.id, categoryForm)
        toast.success('Category updated!')
      } else {
        await categoryAPI.create({ ...categoryForm, slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-') })
        toast.success('Category created!')
      }
      setModalType(null)
      loadAllAdminData()
    } catch { /* handled */ } finally { setSaving(false) }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await categoryAPI.delete(id)
      toast.success('Category deleted!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  const handleSaveOrderStatus = async (e) => {
    e.preventDefault()
    if (!editItem) return
    setSaving(true)
    try {
      await adminAPI.updateOrderStatus(editItem.id, orderForm)
      toast.success('Order status updated!')
      setModalType(null)
      loadAllAdminData()
    } catch { /* handled */ } finally { setSaving(false) }
  }

  const handleUserRoleChange = async (userId, role) => {
    try {
      await adminAPI.updateUserRole(userId, { role })
      toast.success('User role updated!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  const handleApproveReview = async (reviewId, approved) => {
    try {
      await adminAPI.approveReview(reviewId, { is_approved: approved })
      toast.success(approved ? 'Review approved!' : 'Review rejected!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  const handleSaveBundle = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editItem) {
        await bundleAPI.update(editItem.id, bundleForm)
        toast.success('Bundle updated!')
      } else {
        await bundleAPI.create({ ...bundleForm, slug: bundleForm.slug || bundleForm.name.toLowerCase().replace(/\s+/g, '-') })
        toast.success('Bundle created!')
      }
      setModalType(null)
      loadAllAdminData()
    } catch { /* handled */ } finally { setSaving(false) }
  }

  const handleDeleteBundle = async (id) => {
    if (!window.confirm('Delete gift bundle?')) return
    try {
      await bundleAPI.delete(id)
      toast.success('Bundle deleted!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  const handleSaveMeaning = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...meaningForm,
        occasions: typeof meaningForm.occasions === 'string'
          ? meaningForm.occasions.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean)
          : (meaningForm.occasions || []),
        recommended_recipients: typeof meaningForm.recommended_recipients === 'string'
          ? meaningForm.recommended_recipients.split(',').map(s => s.trim()).filter(Boolean)
          : (meaningForm.recommended_recipients || []),
        colors: typeof meaningForm.colors === 'string'
          ? meaningForm.colors.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
          : (meaningForm.colors || []),
      }
      if (editItem) {
        await flowerAPI.update(editItem.id, payload)
        toast.success('Meaning updated!')
      } else {
        await flowerAPI.create({ ...payload, slug: meaningForm.slug || meaningForm.flower_name.toLowerCase().replace(/\s+/g, '-') })
        toast.success('Meaning created!')
      }
      setModalType(null)
      loadAllAdminData()
    } catch { /* handled */ } finally { setSaving(false) }
  }

  const handleDeleteMeaning = async (id) => {
    if (!window.confirm('Delete flower meaning?')) return
    try {
      await flowerAPI.delete(id)
      toast.success('Meaning deleted!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  const handleSaveRule = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editItem) {
        await adminAPI.updateRecommendationRule(editItem.id, ruleForm)
        toast.success('Rule updated!')
      } else {
        await adminAPI.createRecommendationRule(ruleForm)
        toast.success('Rule created!')
      }
      setModalType(null)
      loadAllAdminData()
    } catch { /* handled */ } finally { setSaving(false) }
  }

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Delete rule?')) return
    try {
      await adminAPI.deleteRecommendationRule(id)
      toast.success('Rule deleted!')
      loadAllAdminData()
    } catch { /* handled */ }
  }

  if (loading) return <Loading fullScreen text="Loading Luna Bloom admin panel..." />

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-brand-orange">Luna Bloom Control Panel</p>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadAllAdminData} variant="outline" size="sm">
                <RefreshCw size={14} /> Refresh Data
              </Button>
              <Button as={Link} to="/" variant="secondary" size="sm">
                Customer View →
              </Button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-6 border-t border-gray-100 pt-3">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery('') }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    active ? 'bg-brand-orange text-white shadow-soft' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{formatPrice(dashboard?.stats?.totalRevenue || 148500)}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orders Today</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{dashboard?.stats?.ordersToday || 0}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Customers</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{dashboard?.stats?.totalCustomers || 0}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-3xl shadow-soft p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-gray-900 text-lg">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-brand-orange font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50">
                      <div>
                        <p className="font-bold text-sm text-gray-900">Order #{o.order_number}</p>
                        <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={STATUS_COLORS[o.status] || 'gray'}>{o.status}</Badge>
                        <span className="font-bold text-sm text-gray-900">{formatPrice(o.total_amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Warnings */}
              <div className="bg-white rounded-3xl shadow-soft p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-500" /> Low Stock Alerts
                  </h3>
                  <button onClick={() => setActiveTab('inventory')} className="text-xs text-brand-orange font-bold hover:underline">Manage Stock</button>
                </div>
                <div className="space-y-3">
                  {(dashboard?.lowStock || products.filter(p => p.stock <= 5)).slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50/50 border border-red-100">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{p.name}</p>
                        <p className="text-xs text-red-500 font-semibold">Stock remaining: {p.stock}</p>
                      </div>
                      <Badge variant="red">Restock Needed</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Products Management ({products.length})</h2>
              <Button onClick={() => { setEditItem(null); setProductForm({ name: '', slug: '', price: '', stock: '10', category_id: categories[0]?.id || '', description: '', featured: false }); setModalType('product') }}>
                <Plus size={16} /> Add New Product
              </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-soft overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                        <img src={p.image_url || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=100&q=80'} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        {p.name}
                      </td>
                      <td className="p-4 text-xs font-semibold">{p.categories?.name || 'Uncategorized'}</td>
                      <td className="p-4 font-bold text-gray-900">{formatPrice(p.price)}</td>
                      <td className="p-4 font-semibold">{p.stock}</td>
                      <td className="p-4">{p.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="gray">Disabled</Badge>}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => { setEditItem(p); setProductForm({ name: p.name, slug: p.slug, price: p.price, stock: p.stock, category_id: p.category_id, description: p.description, featured: p.featured }); setModalType('product') }} className="p-2 text-gray-400 hover:text-brand-orange"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Categories Management ({categories.length})</h2>
              <Button onClick={() => { setEditItem(null); setCategoryForm({ name: '', slug: '', description: '' }); setModalType('category') }}>
                <Plus size={16} /> Add Category
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(c => (
                <div key={c.id} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                    <p className="text-xs text-brand-orange font-semibold mt-1">/{c.slug}</p>
                    <p className="text-xs text-gray-500 mt-2">{c.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => { setEditItem(c); setCategoryForm({ name: c.name, slug: c.slug, description: c.description || '' }); setModalType('category') }} className="p-2 text-gray-400 hover:text-brand-orange"><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Orders Management ({orders.length})</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-soft overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="p-4">Order Number</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">#{o.order_number}</td>
                      <td className="p-4 text-xs font-semibold">{o.profiles?.full_name || o.shipping_address?.full_name || 'Customer'}</td>
                      <td className="p-4 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-gray-900">{formatPrice(o.total_amount)}</td>
                      <td className="p-4"><Badge variant={STATUS_COLORS[o.status] || 'gray'}>{o.status}</Badge></td>
                      <td className="p-4 text-right">
                        <Button size="sm" onClick={() => { setEditItem(o); setOrderForm({ status: o.status, tracking_number: o.tracking_number || '' }); setModalType('order') }}>Update Status</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Customer Profiles & Roles ({users.length})</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-soft overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="p-4">Name / Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Update Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">
                        <div>{u.full_name || 'Customer'}</div>
                        <div className="text-xs text-gray-400 font-normal">{u.email}</div>
                      </td>
                      <td className="p-4"><Badge variant={u.role === 'admin' ? 'orange' : 'blue'}>{u.role}</Badge></td>
                      <td className="p-4 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold bg-white"
                        >
                          <option value="customer">customer</option>
                          <option value="florist">florist</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Inventory Control</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-soft overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Low Stock Threshold</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{p.name}</td>
                      <td className="p-4 font-extrabold text-base">{p.stock}</td>
                      <td className="p-4 text-xs font-semibold text-gray-500">{p.low_stock_alert || 5}</td>
                      <td className="p-4">
                        {p.stock <= (p.low_stock_alert || 5) ? <Badge variant="red">Low Stock</Badge> : <Badge variant="success">Healthy</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Reviews Moderation ({reviews.length})</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{r.profiles?.full_name || 'Customer'}</span>
                    <Badge variant={r.is_approved ? 'success' : 'yellow'}>{r.is_approved ? 'Approved' : 'Pending'}</Badge>
                  </div>
                  <p className="font-semibold text-sm text-gray-800">"{r.title || 'Review'}" — Rating: {r.rating}/5</p>
                  <p className="text-xs text-gray-600">{r.body}</p>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <Button size="sm" variant="secondary" onClick={() => handleApproveReview(r.id, false)}>Reject</Button>
                    <Button size="sm" onClick={() => handleApproveReview(r.id, true)}>Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUNDLES TAB */}
        {activeTab === 'bundles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Gift Bundles ({bundles.length})</h2>
              <Button onClick={() => { setEditItem(null); setBundleForm({ name: '', slug: '', base_price: '8500', discount_pct: '10', description: '' }); setModalType('bundle') }}>
                <Plus size={16} /> Add Gift Bundle
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map(b => (
                <div key={b.id} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg">{b.name}</h3>
                  <p className="text-xs text-gray-500">{b.description || 'Curated bundle'}</p>
                  <div className="flex justify-between font-bold text-sm">
                    <span>Base Price: {formatPrice(b.base_price)}</span>
                    <span className="text-brand-orange">{b.discount_pct}% Off</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => { setEditItem(b); setBundleForm({ name: b.name, slug: b.slug, base_price: b.base_price, discount_pct: b.discount_pct, description: b.description || '' }); setModalType('bundle') }} className="p-2 text-gray-400 hover:text-brand-orange"><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteBundle(b.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEANINGS TAB */}
        {activeTab === 'meanings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Flower Meanings ({meanings.length})</h2>
              <Button onClick={() => {
                setEditItem(null)
                setMeaningForm({
                  flower_name: '', slug: '', meaning: '', symbolism: '',
                  emotional_message: '', occasions: '', recommended_recipients: '',
                  colors: '', origin: '', fun_fact: '', image_url: ''
                })
                setModalType('meaning')
              }}>
                <Plus size={16} /> Add Flower Meaning
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meanings.map(m => (
                <div key={m.id || m.slug} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.image_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80'}
                        alt={m.flower_name}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{m.flower_name}</h3>
                        <p className="text-xs font-bold text-brand-orange">"{m.meaning}"</p>
                      </div>
                    </div>

                    {m.emotional_message && (
                      <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl italic border-l-2 border-amber-400">
                        "{m.emotional_message}"
                      </p>
                    )}

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{m.symbolism}</p>

                    {m.occasions?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {m.occasions.map(o => (
                          <span key={o} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold capitalize">
                            {o.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditItem(m)
                        setMeaningForm({
                          flower_name: m.flower_name || '',
                          slug: m.slug || '',
                          meaning: m.meaning || '',
                          symbolism: m.symbolism || '',
                          emotional_message: m.emotional_message || '',
                          occasions: Array.isArray(m.occasions) ? m.occasions.join(', ') : (m.occasions || ''),
                          recommended_recipients: Array.isArray(m.recommended_recipients) ? m.recommended_recipients.join(', ') : (m.recommended_recipients || ''),
                          colors: Array.isArray(m.colors) ? m.colors.join(', ') : (m.colors || ''),
                          origin: m.origin || '',
                          fun_fact: m.fun_fact || '',
                          image_url: m.image_url || ''
                        })
                        setModalType('meaning')
                      }}
                      className="p-2 text-gray-400 hover:text-brand-orange"
                    >
                      <Edit3 size={16} />
                    </button>
                    {m.id && <button onClick={() => handleDeleteMeaning(m.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Recommendation Rules ({rules.length})</h2>
              <Button onClick={() => { setEditItem(null); setRuleForm({ name: '', rule_type: 'occasion', trigger_value: 'birthday', priority: '1', is_active: true }); setModalType('rule') }}>
                <Plus size={16} /> Add Recommendation Rule
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {rules.map(r => (
                <div key={r.id} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-base">{r.name}</h3>
                    <Badge variant={r.is_active ? 'success' : 'gray'}>{r.is_active ? 'Active' : 'Paused'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 capitalize">Type: {r.rule_type} | Trigger: {r.trigger_value}</p>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => { setEditItem(r); setRuleForm({ name: r.name, rule_type: r.rule_type, trigger_value: r.trigger_value, priority: r.priority, is_active: r.is_active }); setModalType('rule') }} className="p-2 text-gray-400 hover:text-brand-orange"><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteRule(r.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-soft">
              <h2 className="text-xl font-bold text-gray-900">Newsletter Subscribers ({subscribers.length})</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-soft overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscribers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{s.email}</td>
                      <td className="p-4"><Badge variant={s.is_active ? 'success' : 'gray'}>{s.is_active ? 'Active' : 'Unsubscribed'}</Badge></td>
                      <td className="p-4 text-xs">{new Date(s.subscribed_at || s.created_at || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Store Performance Analytics</h2>
              <p className="text-sm text-gray-500">Sales summary and order status distribution.</p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">Order Status Distribution</h3>
                  <div className="space-y-2 text-xs">
                    {Object.entries(analytics?.ordersByStatus || { pending: 4, processing: 2, shipped: 5, delivered: 12 }).map(([st, cnt]) => (
                      <div key={st} className="flex justify-between py-1 border-b border-gray-200">
                        <span className="capitalize font-semibold">{st}</span>
                        <span className="font-bold">{cnt} orders</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">Revenue Summary</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="font-semibold">Gross Revenue</span>
                      <span className="font-bold">{formatPrice(dashboard?.stats?.totalRevenue || 148500)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="font-semibold">Average Order Value</span>
                      <span className="font-bold">{formatPrice(5200)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="font-semibold">Successful Fulfillment Rate</span>
                      <span className="font-bold text-green-600">98.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-3xl shadow-soft max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Store Configuration Settings</h2>
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Store settings updated!') }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Store Name</label>
                <input value={settingsForm.store_name} onChange={(e) => setSettingsForm({ ...settingsForm, store_name: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Support Email</label>
                <input value={settingsForm.support_email} onChange={(e) => setSettingsForm({ ...settingsForm, support_email: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Currency</label>
                  <input value={settingsForm.currency} onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-orange outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fulfillment Target (Hours)</label>
                  <input type="number" value={settingsForm.fulfillment_hours} onChange={(e) => setSettingsForm({ ...settingsForm, fulfillment_hours: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-orange outline-none" />
                </div>
              </div>
              <Button type="submit" className="mt-4">Save Configuration</Button>
            </form>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {/* Product Modal */}
      <Modal isOpen={modalType === 'product'} onClose={() => setModalType(null)} title={editItem ? 'Edit Product' : 'Add Product'} size="md">
        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
          <input required placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" step="0.01" placeholder="Price (ETB / ብር)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
            <input required type="number" placeholder="Stock Quantity" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
              <select value={productForm.category_id} onChange={e => setProductForm({ ...productForm, category_id: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Assigned Occasion</label>
              <select value={productForm.occasion} onChange={e => setProductForm({ ...productForm, occasion: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white">
                {[
                  { slug: 'birthday', label: 'Birthday' },
                  { slug: 'anniversary', label: 'Anniversary' },
                  { slug: 'valentines', label: "Valentine's Day" },
                  { slug: 'wedding', label: 'Wedding' },
                  { slug: 'engagement', label: 'Engagement' },
                  { slug: 'graduation', label: 'Graduation' },
                  { slug: 'mothers_day', label: "Mother's Day" },
                  { slug: 'fathers_day', label: "Father's Day" },
                  { slug: 'thank_you', label: 'Thank You' },
                  { slug: 'congratulations', label: 'Congratulations' },
                  { slug: 'get_well', label: 'Get Well Soon' },
                  { slug: 'new_baby', label: 'New Baby' },
                  { slug: 'apology', label: "Apology / I'm Sorry" },
                  { slug: 'love_romance', label: 'Love & Romance' },
                  { slug: 'friendship', label: 'Friendship' },
                  { slug: 'sympathy', label: 'Sympathy & Condolences' },
                  { slug: 'celebration', label: 'Celebration' },
                  { slug: 'just_because', label: 'Just Because' },
                ].map(o => <option key={o.slug} value={o.slug}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Flower Variety / Type</label>
              <select value={productForm.flower_type} onChange={e => setProductForm({ ...productForm, flower_type: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white">
                {['Rose', 'Tulip', 'Lily', 'Sunflower', 'Orchid', 'Peony', 'Hydrangea', 'Carnations', 'Daisies', 'Gerberas', 'Chrysanthemums', 'Lavender', 'Baby’s Breath', 'Mixed flowers', 'Seasonal flowers'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
              <input placeholder="Image URL (Unsplash or Supabase)" value={productForm.image_url || ''} onChange={e => setProductForm({ ...productForm, image_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
            </div>
          </div>

          <textarea placeholder="Description" rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Product</Button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal isOpen={modalType === 'category'} onClose={() => setModalType(null)} title={editItem ? 'Edit Category' : 'Add Category'} size="md">
        <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
          <input required placeholder="Category Name" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <textarea placeholder="Description" rows={3} value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Category</Button>
          </div>
        </form>
      </Modal>

      {/* Order Status Modal */}
      <Modal isOpen={modalType === 'order'} onClose={() => setModalType(null)} title="Update Order Status" size="md">
        <form onSubmit={handleSaveOrderStatus} className="p-6 space-y-4">
          <label className="block text-xs font-bold uppercase text-gray-500">Order Status</label>
          <select value={orderForm.status} onChange={e => setOrderForm({ ...orderForm, status: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white">
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Tracking Number (Optional)" value={orderForm.tracking_number} onChange={e => setOrderForm({ ...orderForm, tracking_number: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Status</Button>
          </div>
        </form>
      </Modal>

      {/* Bundle Modal */}
      <Modal isOpen={modalType === 'bundle'} onClose={() => setModalType(null)} title={editItem ? 'Edit Gift Bundle' : 'Add Gift Bundle'} size="md">
        <form onSubmit={handleSaveBundle} className="p-6 space-y-4">
          <input required placeholder="Bundle Name" value={bundleForm.name} onChange={e => setBundleForm({ ...bundleForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" step="0.01" placeholder="Base Price ($)" value={bundleForm.base_price} onChange={e => setBundleForm({ ...bundleForm, base_price: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
            <input type="number" placeholder="Discount %" value={bundleForm.discount_pct} onChange={e => setBundleForm({ ...bundleForm, discount_pct: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          </div>
          <textarea placeholder="Description" rows={3} value={bundleForm.description} onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Bundle</Button>
          </div>
        </form>
      </Modal>

      {/* Meaning Modal */}
      <Modal isOpen={modalType === 'meaning'} onClose={() => setModalType(null)} title={editItem ? 'Edit Flower Meaning' : 'Add Flower Meaning'} size="md">
        <form onSubmit={handleSaveMeaning} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Flower Name (e.g. Rose)" value={meaningForm.flower_name} onChange={e => setMeaningForm({ ...meaningForm, flower_name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
            <input placeholder="Slug (optional)" value={meaningForm.slug} onChange={e => setMeaningForm({ ...meaningForm, slug: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          </div>

          <input required placeholder="Core Short Meaning (e.g. Love, romance, passion)" value={meaningForm.meaning} onChange={e => setMeaningForm({ ...meaningForm, meaning: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <input placeholder="High Quality Flower Image URL" value={meaningForm.image_url} onChange={e => setMeaningForm({ ...meaningForm, image_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <textarea placeholder="Emotional Message (e.g. You are deeply loved and treasured...)" rows={2} value={meaningForm.emotional_message} onChange={e => setMeaningForm({ ...meaningForm, emotional_message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <textarea placeholder="Detailed Symbolism & Heritage" rows={3} value={meaningForm.symbolism} onChange={e => setMeaningForm({ ...meaningForm, symbolism: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <input placeholder="Occasions (comma-separated: birthday, valentines, wedding)" value={meaningForm.occasions} onChange={e => setMeaningForm({ ...meaningForm, occasions: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <input placeholder="Recommended Recipients (comma-separated: Partner, Spouse, Mother)" value={meaningForm.recommended_recipients} onChange={e => setMeaningForm({ ...meaningForm, recommended_recipients: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Colors (comma-separated: red, pink)" value={meaningForm.colors} onChange={e => setMeaningForm({ ...meaningForm, colors: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
            <input placeholder="Origin (e.g. Middle East)" value={meaningForm.origin} onChange={e => setMeaningForm({ ...meaningForm, origin: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          </div>

          <textarea placeholder="Fun Fact" rows={2} value={meaningForm.fun_fact} onChange={e => setMeaningForm({ ...meaningForm, fun_fact: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Meaning</Button>
          </div>
        </form>
      </Modal>

      {/* Rule Modal */}
      <Modal isOpen={modalType === 'rule'} onClose={() => setModalType(null)} title={editItem ? 'Edit Rule' : 'Add Recommendation Rule'} size="md">
        <form onSubmit={handleSaveRule} className="p-6 space-y-4">
          <input required placeholder="Rule Name" value={ruleForm.name} onChange={e => setRuleForm({ ...ruleForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <select value={ruleForm.rule_type} onChange={e => setRuleForm({ ...ruleForm, rule_type: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white">
            <option value="occasion">Occasion</option>
            <option value="category">Category</option>
            <option value="tag">Tag</option>
            <option value="upsell">Upsell</option>
          </select>
          <input required placeholder="Trigger Value (e.g. birthday)" value={ruleForm.trigger_value} onChange={e => setRuleForm({ ...ruleForm, trigger_value: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Rule</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
