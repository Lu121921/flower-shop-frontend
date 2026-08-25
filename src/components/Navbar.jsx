import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, User, ShoppingBag, Menu, X, LogOut,
  Package, ChevronDown, Heart, LayoutDashboard, Home,
  Flower2, Gift, Info, Phone, BookOpen, Sparkles, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Build', children: [
      { name: 'Bouquet Builder', path: '/bouquet-builder' },
      { name: 'Gift Bundles', path: '/gift-bundles' },
      { name: 'Recommendations', path: '/recommendations' },
    ]
  },
  { name: 'Categories', path: '/categories' },
  {
    name: 'Occasions',
    path: '/occasions',
    children: [
      { name: 'Explore All Occasions', path: '/occasions' },
      { name: 'Birthday', path: '/occasions?occasion=birthday' },
      { name: 'Anniversary', path: '/occasions?occasion=anniversary' },
      { name: "Valentine's Day", path: '/occasions?occasion=valentines' },
      { name: 'Wedding', path: '/occasions?occasion=wedding' },
      { name: 'Engagement', path: '/occasions?occasion=engagement' },
      { name: 'Graduation', path: '/occasions?occasion=graduation' },
      { name: "Mother's Day", path: '/occasions?occasion=mothers_day' },
      { name: "Father's Day", path: '/occasions?occasion=fathers_day' },
      { name: 'Thank You', path: '/occasions?occasion=thank_you' },
      { name: 'Congratulations', path: '/occasions?occasion=congratulations' },
      { name: 'Get Well Soon', path: '/occasions?occasion=get_well' },
      { name: 'New Baby', path: '/occasions?occasion=new_baby' },
      { name: 'Apology', path: '/occasions?occasion=apology' },
      { name: 'Love & Romance', path: '/occasions?occasion=love_romance' },
      { name: 'Friendship', path: '/occasions?occasion=friendship' },
      { name: 'Sympathy & Condolences', path: '/occasions?occasion=sympathy' },
      { name: 'Celebration', path: '/occasions?occasion=celebration' },
      { name: 'Just Because', path: '/occasions?occasion=just_because' },
    ],
  },
  { name: 'Flower Meanings', path: '/flower-meanings' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)
  const { user, profile, signOut } = useAuth()
  const { getCartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = getCartCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-soft' : 'border-b border-gray-100'}`}>
      {/* Top announcement bar */}
      <div className="bg-brand-green text-white text-xs py-2 text-center font-medium tracking-wide">
        🌸 Free delivery on orders over 5,000 ETB · Same-day delivery available · Order before 1PM
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
              <Flower2 size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-brand-green" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
              Luna Bloom's
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors rounded-lg hover:bg-brand-orange-pale">
                    {link.name}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'text-brand-orange bg-brand-orange-pale'
                      : 'text-gray-700 hover:text-brand-orange hover:bg-brand-orange-pale'
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-orange transition-colors text-sm font-semibold text-gray-700 hover:text-brand-orange"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-bold">
                    {(profile?.full_name || user.email || '?')[0].toUpperCase()}
                  </div>
                  <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-bold text-gray-800 truncate">{profile?.full_name || 'My Account'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {[
                        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
                        ...(profile?.role === 'admin' ? [{ icon: ShieldCheck, label: 'Admin', to: '/admin' }] : []),
                        { icon: User, label: 'Profile', to: '/profile' },
                        { icon: Package, label: 'My Orders', to: '/orders' },
                        { icon: Heart, label: 'Wishlist', to: '/wishlist' },
                      ].map(({ icon: Icon, label, to }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"
                        >
                          <Icon size={15} /> {label}
                        </Link>
                      ))}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors px-3 py-1.5">
                  Sign In
                </Link>
                <Link to="/register" className="btn-orange !py-2 !px-4 text-xs">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: search + wishlist + cart + hamburger */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand-orange"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="relative w-9 h-9 flex items-center justify-center text-gray-600">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center text-gray-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="w-9 h-9 flex items-center justify-center text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSearch}
              className="overflow-hidden pb-3"
            >
              <div className="relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search flowers, bouquets, occasions…"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-gray-50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-orange !py-1.5 !px-3 text-xs"
                >
                  Search
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {[
                { icon: Home, label: 'Home', to: '/' },
                { icon: Flower2, label: 'Shop All Flowers', to: '/shop' },
                { icon: Sparkles, label: 'Bouquet Builder', to: '/bouquet-builder' },
                { icon: Gift, label: 'Gift Bundles', to: '/gift-bundles' },
                { icon: Sparkles, label: 'Recommendations', to: '/recommendations' },
                { icon: Flower2, label: 'Categories', to: '/categories' },
                { icon: Gift, label: 'Occasions', to: '/occasions' },
                { icon: BookOpen, label: 'Flower Meanings', to: '/flower-meanings' },
                { icon: Info, label: 'About Us', to: '/about' },
                { icon: Phone, label: 'Contact', to: '/contact' },
              ].map(({ icon: Icon, label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"
                >
                  <Icon size={17} /> {label}
                </Link>
              ))}
              <hr className="border-gray-100 !my-3" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-orange-pale transition-colors"><LayoutDashboard size={17} /> Dashboard</Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-orange hover:bg-brand-orange-pale transition-colors"><ShieldCheck size={17} /> Admin Panel</Link>
                  )}
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-orange-pale transition-colors"><User size={17} /> Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-orange-pale transition-colors"><Package size={17} /> My Orders</Link>
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-orange-pale transition-colors"><Heart size={17} /> Wishlist ({wishlistCount})</Link>
                  <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"><LogOut size={17} /> Sign Out</button>
                </>
              ) : (
                <div className="flex gap-3 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-brand-orange border-2 border-brand-orange rounded-full hover:bg-brand-orange-pale transition-colors">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-orange text-center !py-2.5">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
