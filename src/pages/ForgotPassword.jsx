import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/Input'

export default function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (!error) setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {sent ? (
          <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Check Your Email</h2>
            <p className="text-gray-500 text-sm">We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.</p>
            <Link to="/login" className="btn-orange inline-flex mx-auto mt-2">Back to Sign In</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-brand-orange-pale flex items-center justify-center mx-auto mb-4">
                <Mail size={26} className="text-brand-orange" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mt-2">No worries! Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email Address" type="email" icon={Mail} required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              <button type="submit" disabled={loading} className="btn-orange w-full justify-center py-3.5">{loading ? 'Sending…' : 'Send Reset Link'}</button>
            </form>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
