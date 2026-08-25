import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flower2, Heart, Award, Truck, Users, Leaf } from 'lucide-react'

const TEAM = [
  { name: 'Sarah Chen', role: 'Head Florist & Founder', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'James Wilson', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Mia Park', role: 'Senior Florist', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
  { name: 'Tom Brooks', role: 'Delivery Manager', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
]

const VALUES = [
  { icon: Heart,  title: 'Made with Love',    desc: 'Every arrangement is handcrafted with passion and care by our expert florists.' },
  { icon: Leaf,   title: 'Sustainably Sourced', desc: 'We partner with farms that share our commitment to ethical and sustainable practices.' },
  { icon: Award,  title: 'Premium Quality',  desc: 'Only the freshest, finest blooms make it into our arrangements.' },
  { icon: Truck,  title: 'Reliable Delivery', desc: 'Same-day and next-day delivery options available across Sydney.' },
  { icon: Users,  title: 'Community First', desc: 'Supporting local growers and giving back to the communities we serve.' },
  { icon: Flower2, title: 'Floral Expertise', desc: 'Our team brings decades of combined experience and a deep love for flowers.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[500px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80" alt="Luna Bloom's Floral Design Studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-green/60 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>Our Story</h1>
            <p className="text-white/90 max-w-xl text-lg leading-relaxed">Bringing nature's beauty to your doorstep since 2019.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Born from a Passion<br />for Beautiful Blooms</h2>
              <p className="text-gray-600 leading-relaxed">Luna Bloom's was founded in 2019 by Sarah Chen, a passionate florist with a dream to make premium flowers accessible to everyone. What started as a small pop-up stall at the Sydney Flower Market has grown into one of the city's most loved flower shops.</p>
              <p className="text-gray-600 leading-relaxed">We believe that flowers have the power to transform moments — from quiet Tuesday mornings to grand celebrations. Our team of expert florists handcraft every arrangement with the same care and attention to detail, whether it's a single stem or an elaborate wedding installation.</p>
              <Link to="/shop" className="btn-orange inline-flex">Shop Our Collection</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&q=80" alt="Fresh tulips in bloom" className="rounded-2xl h-52 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80" alt="Hand-tied flower bouquet" className="rounded-2xl h-52 w-full object-cover mt-8" />
              <img src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80" alt="Blush roses arrangement" className="rounded-2xl h-52 w-full object-cover -mt-4" />
              <img src="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=80" alt="Luxury hat box arrangement" className="rounded-2xl h-52 w-full object-cover mt-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-orange py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[['5,000+', 'Happy Customers'], ['10,000+', 'Orders Delivered'], ['50+', 'Flower Varieties'], ['4.9★', 'Average Rating']].map(([val, label], i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl font-extrabold mb-1">{val}</div>
                <div className="text-white/80 text-sm font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">What We Stand For</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">Our values guide everything we do, from sourcing to delivery.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-brand-orange-pale flex items-center justify-center mb-4"><Icon size={22} className="text-brand-orange" /></div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">The passionate people behind every beautiful arrangement.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, img }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-brand-orange-pale">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-800">{name}</h3>
                <p className="text-sm text-brand-orange font-medium mt-0.5">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
