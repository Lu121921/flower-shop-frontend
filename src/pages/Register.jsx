import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Flower2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/Input'

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.full_name) e.full_name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    const { error } = await signUp(form.email, form.password, { full_name: form.full_name, phone: form.phone })
    setLoading(false)
    if (!error) navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=900&q=80" alt="Fresh blush rose bouquet" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-orange/60 flex flex-col items-center justify-center text-white p-12">
          <Flower2 size={48} className="mb-4" />
          <h2 className="text-4xl font-extrabold text-center" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>Join Us</h2>
          <p className="text-center text-white/80 max-w-xs mt-3">Create your account and get 10% off your first order. Fresh flowers delivered to your door.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-2">Join Luna Bloom's and start shopping</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-soft">
            <Input label="Full Name" icon={User} required value={form.full_name} onChange={set('full_name')} error={errors.full_name} placeholder="Jane Smith" />
            <Input label="Email Address" type="email" icon={Mail} required value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
            <Input label="Phone (optional)" type="tel" icon={Phone} value={form.phone} onChange={set('phone')} placeholder="+61 400 000 000" />
            <Input label="Password" type="password" icon={Lock} required value={form.password} onChange={set('password')} error={errors.password} placeholder="Minimum 8 characters" />
            <Input label="Confirm Password" type="password" icon={Lock} required value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="Repeat password" />
            <p className="text-xs text-gray-500">By creating an account you agree to our <a href="#" className="text-brand-orange hover:underline">Terms</a> and <a href="#" className="text-brand-orange hover:underline">Privacy Policy</a>.</p>
            <button type="submit" disabled={loading} className="btn-orange w-full justify-center py-3.5 text-base">{loading ? 'Creating Account…' : 'Create Account'}</button>
            <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-brand-orange font-bold hover:underline">Sign in</Link></p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
