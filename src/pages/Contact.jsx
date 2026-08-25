import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { contactAPI } from '../services/api'
import Input from '../components/Input'

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name)    e.name = 'Required'
    if (!form.email)   e.email = 'Required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.subject) e.subject = 'Required'
    if (!form.message) e.message = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    try {
      await contactAPI.send(form)
      setSent(true)
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-orange-pale to-brand-green-pale py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Get in Touch</h1>
          <p className="text-gray-600 max-w-md mx-auto text-sm">We're here to help with orders, custom arrangements and anything in between.</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            {[
              { icon: Phone, title: 'Phone', lines: ['(02) 7234 5678', 'Mon–Sat 8AM–6PM'] },
              { icon: Mail, title: 'Email', lines: ['hello@lunablooms.com', 'We reply within 2 hours'] },
              { icon: MapPin, title: 'Visit Us', lines: ['42 Bloom Street', 'Sydney NSW 2000'] },
              { icon: Clock, title: 'Hours', lines: ['Mon–Fri: 8AM–7PM', 'Sat–Sun: 9AM–5PM'] },
            ].map(({ icon: Icon, title, lines }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-orange-pale flex items-center justify-center flex-shrink-0"><Icon size={18} className="text-brand-orange" /></div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{title}</p>
                  {lines.map((l, j) => <p key={j} className="text-sm text-gray-500">{l}</p>)}
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-52 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" alt="Map" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-xl px-4 py-2 shadow-card"><MapPin size={16} className="text-brand-orange inline mr-1" /><span className="text-sm font-bold text-gray-800">42 Bloom St, Sydney</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"><CheckCircle size={32} className="text-green-500" /></div>
                <h2 className="text-2xl font-extrabold text-gray-900">Message Sent!</h2>
                <p className="text-gray-500 text-sm">Thank you for reaching out. We'll get back to you within 2 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }} className="btn-orange mx-auto">Send Another</button>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-5">
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send Us a Message</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Your Name" required value={form.name} onChange={set('name')} error={errors.name} placeholder="Jane Smith" autoComplete="name" />
                  <Input label="Email" type="email" required value={form.email} onChange={set('email')} error={errors.email} placeholder="jane@email.com" autoComplete="email" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Phone (optional)" type="tel" value={form.phone} onChange={set('phone')} placeholder="+61 400 000 000" autoComplete="tel" />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject <span className="text-brand-orange">*</span></label>
                    <select value={form.subject} onChange={set('subject')} className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange ${errors.subject ? 'border-red-400' : 'border-gray-200'}`}>
                      <option value="">Select a subject</option>
                      {['Order Enquiry', 'Custom Arrangement', 'Delivery Question', 'Corporate Orders', 'Wedding Flowers', 'Feedback', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.subject}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-brand-orange">*</span></label>
                  <textarea value={form.message} onChange={set('message')} rows={5} placeholder="Tell us how we can help…" className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.message && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-orange w-full justify-center py-3.5">
                  <Send size={16} /> {loading ? 'Sending…' : 'Send Message'}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
