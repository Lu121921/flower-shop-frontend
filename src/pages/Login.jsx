import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Flower2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/Input'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [params]   = useSearchParams()
  const redirect   = params.get('redirect') || '/dashboard'

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (!error) navigate(redirect, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left image panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=80" alt="Luna Bloom's romantic pink flower arrangement" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-green/60 flex flex-col items-center justify-center text-white p-12">
          <Flower2 size={48} className="mb-4 opacity-90" />
          <h2 className="text-4xl font-extrabold text-center leading-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>Luna Bloom's</h2>
          <p className="text-center text-white/80 max-w-xs">Welcome back! Sign in to explore our beautiful collection and manage your orders.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to your Luna Bloom's account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl shadow-soft">
            <Input label="Email Address" type="email" icon={Mail} required value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" autoComplete="email" />
            <Input label="Password" type="password" icon={Lock} required value={form.password} onChange={set('password')} error={errors.password} placeholder="••••••••" autoComplete="current-password" />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-brand-orange" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-brand-orange hover:underline font-semibold">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-orange w-full justify-center py-3.5 text-base">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-orange font-bold hover:underline">Create one</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
