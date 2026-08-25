import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Instagram, Facebook, Youtube, Mail, Phone, MapPin,
  Flower2, ArrowRight, ShieldCheck, Truck, Sparkles,
  ChevronUp, Heart, Send
} from 'lucide-react'
import toast from 'react-hot-toast'

const SHOP_LINKS = [
  { label: 'Fresh Bouquets', to: '/shop?category=bouquets' },
  { label: 'Luxury Hat Boxes', to: '/shop?category=hat-boxes' },
  { label: 'Indoor Plants', to: '/shop?category=plants' },
  { label: 'Gift Hampers', to: '/shop?category=gift-hampers' },
  { label: 'Seasonal Specials', to: '/shop?category=seasonal' },
  { label: 'Wedding Flowers', to: '/shop?category=weddings' },
  { label: 'Dried Arrangements', to: '/shop?category=dried-flowers' },
]

const OCCASION_LINKS = [
  { label: 'All 18 Occasions Hub', to: '/occasions' },
  { label: 'Birthday Blooms', to: '/occasions?occasion=birthday' },
  { label: 'Anniversary Romance', to: '/occasions?occasion=anniversary' },
  { label: 'Sympathy & Comfort', to: '/occasions?occasion=sympathy' },
  { label: 'Thank You Flowers', to: '/occasions?occasion=thank_you' },
  { label: 'Flower Meanings Guide', to: '/flower-meanings' },
  { label: 'Curated Gift Bundles', to: '/gift-bundles' },
]

const CARE_LINKS = [
  { label: 'My Account', to: '/dashboard' },
  { label: 'Order History', to: '/orders' },
  { label: 'Track Order', to: '/orders/track' },
  { label: 'FAQ & Delivery Info', to: '/faq' },
  { label: 'Our Story & Team', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

const INSTA_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80', alt: 'Blush roses arrangement' },
  { src: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=200&q=80', alt: 'Red Ecuador rose hat box' },
  { src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80', alt: 'Deep red rose bloom' },
  { src: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&q=80', alt: 'Golden sunflowers' },
  { src: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=200&q=80', alt: 'Spring pastel tulips' },
  { src: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=200&q=80', alt: 'Dried lavender bouquet' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setSubscribed(true)
    toast.success('Welcome to Luna Bloom\'s! 🌸 Check your inbox for 10% off your first order.')
    setEmail('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#13220f] text-stone-200 relative overflow-hidden font-sans border-t border-white/10">
      {/* Subtle top glowing gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-orange via-amber-300 to-brand-orange opacity-80" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        
        {/* Newsletter Section */}
        <div className="bg-[#1a2e15] border border-white/10 rounded-3xl p-8 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid lg:grid-cols-[1.2fr_1fr] items-center gap-8 relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-orange mb-3">
                <Sparkles size={14} /> Join The Bloom Club
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Receive floral care tips, seasonal blooms & 10% off your first gift.
              </h3>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                Handcrafted arrangements delivered fresh across Addis Ababa. Subscribe to our newsletter for exclusive offers.
              </p>
            </div>

            <div>
              {subscribed ? (
                <div className="bg-brand-orange/20 border border-brand-orange/40 rounded-2xl p-4 text-center">
                  <p className="text-sm font-semibold text-brand-orange-pale">🎉 Thank you for subscribing! Code: <span className="font-extrabold text-white">BLOOM10</span></p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/20 rounded-full text-sm text-white placeholder-stone-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-orange flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold text-sm whitespace-nowrap shadow-orange hover:scale-105 transition-transform"
                  >
                    Subscribe <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 5-Column Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <Flower2 size={22} />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                Luna Bloom's
              </span>
            </Link>

            <p className="text-sm text-stone-300 leading-relaxed max-w-md">
              Artisan floral design for life's unforgettable moments. Fresh, ethically sourced blooms arranged by master florists and delivered with love across Ethiopia.
            </p>

            <div className="space-y-3 pt-1 text-sm text-stone-300">
              <a href="tel:+251911234567" className="flex items-center gap-3 hover:text-brand-orange transition-colors">
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <Phone size={14} />
                </div>
                <span>+251 911 234 567</span>
              </a>
              <a href="mailto:hello@lunablooms.com" className="flex items-center gap-3 hover:text-brand-orange transition-colors">
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <Mail size={14} />
                </div>
                <span>hello@lunablooms.com</span>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <MapPin size={14} />
                </div>
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                { href: 'https://facebook.com', Icon: Facebook, label: 'Facebook' },
                { href: 'https://youtube.com', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange hover:text-white text-stone-300 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Shop Collections */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-200/90 mb-5 pb-2 border-b border-white/10 inline-block">
              Shop Collections
            </h4>
            <ul className="space-y-3 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-stone-300 hover:text-brand-orange hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    <span className="text-brand-orange opacity-0 -ml-3 transition-opacity group-hover:opacity-100">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Occasions & Guides */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-200/90 mb-5 pb-2 border-b border-white/10 inline-block">
              Occasions & Guides
            </h4>
            <ul className="space-y-3 text-sm">
              {OCCASION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-stone-300 hover:text-brand-orange hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care & Gallery */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-200/90 mb-5 pb-2 border-b border-white/10 inline-block">
                Customer Care
              </h4>
              <ul className="space-y-3 text-sm">
                {CARE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-stone-300 hover:text-brand-orange hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-1.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini Instagram Showcase */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">@lunablooms</p>
              <div className="grid grid-cols-3 gap-1.5">
                {INSTA_PHOTOS.map((item, i) => (
                  <a
                    key={i}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg aspect-square bg-white/5"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-brand-orange/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Instagram size={14} className="text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Value Badges Bar */}
        <div className="py-8 border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-orange">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Same-Day Express Delivery</p>
              <p className="text-xs text-stone-400">Order before 1:00 PM AEDT</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-orange">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Freshness Guarantee</p>
              <p className="text-xs text-stone-400">Fresh from farm to doorstep</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-orange">
              <Heart size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Artisan Floral Stylists</p>
              <p className="text-xs text-stone-400">Hand-tied with love & care</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} LUNA BLOOM'S. All rights reserved. Crafted with love for flower lovers.</p>

          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/faq" className="hover:text-white transition-colors">Delivery Terms</Link>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-stone-300 hover:text-brand-orange transition-colors font-semibold py-1 px-3 rounded-full bg-white/5 border border-white/10 hover:border-brand-orange/50"
          >
            <span>Back to top</span>
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
