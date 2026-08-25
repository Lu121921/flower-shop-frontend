import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Camera, MapPin, Plus, Trash2, Edit2, Check } from 'lucide-react'
import { userAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import Input from '../components/Input'
import Badge from '../components/Badge'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [tab, setTab]         = useState('profile')
  const [saving, setSaving]   = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addingAddr, setAddingAddr] = useState(false)
  const [editAddrId, setEditAddrId] = useState(null)

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
  })

  const [addrForm, setAddrForm] = useState({ label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'Australia', is_default: false })

  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '', date_of_birth: profile.date_of_birth || '' })
  }, [profile])

  useEffect(() => {
    userAPI.getAddresses().then(r => setAddresses(r.data?.addresses || [])).catch(() => {})
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userAPI.updateProfile(form)
      await refreshProfile()
      toast.success('Profile updated!')
    } catch { /* handled */ }
    finally { setSaving(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.password !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.password })
    setSaving(false)
    if (!error) { toast.success('Password updated!'); setPwForm({ password: '', confirm: '' }) }
    else toast.error(error.message)
  }

  const handleSaveAddr = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editAddrId) {
        await userAPI.updateAddress(editAddrId, addrForm)
      } else {
        await userAPI.createAddress(addrForm)
      }
      const r = await userAPI.getAddresses()
      setAddresses(r.data?.addresses || [])
      setAddingAddr(false)
      setEditAddrId(null)
      setAddrForm({ label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'Australia', is_default: false })
      toast.success(editAddrId ? 'Address updated' : 'Address added')
    } catch { /* handled */ }
    finally { setSaving(false) }
  }

  const handleDeleteAddr = async (id) => {
    await userAPI.deleteAddress(id)
    setAddresses(a => a.filter(x => x.id !== id))
    toast.success('Address deleted')
  }

  const startEditAddr = (addr) => {
    setAddrForm({ ...addr })
    setEditAddrId(addr.id)
    setAddingAddr(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-soft mb-8 overflow-x-auto hide-scrollbar">
          {[['profile', 'Profile'], ['addresses', 'Addresses'], ['security', 'Security']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${tab === key ? 'bg-brand-orange text-white shadow-orange' : 'text-gray-600 hover:text-brand-orange'}`}>{label}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-brand-orange flex items-center justify-center text-white text-3xl font-bold">
                    {(profile?.full_name || user?.email || '?')[0].toUpperCase()}
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center border border-gray-100 hover:bg-brand-orange-pale transition-colors">
                    <Camera size={13} className="text-brand-orange" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{profile?.full_name || 'Your Name'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {profile?.role && <Badge variant="green" size="sm" className="mt-1">{profile.role}</Badge>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Full Name" icon={User} required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                <Input label="Phone" icon={Phone} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <Input label="Email" icon={Mail} value={user?.email || ''} disabled hint="Email cannot be changed" />
                <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
              </div>
              <button type="submit" disabled={saving} className="btn-orange">{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </motion.div>
        )}

        {tab === 'addresses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white rounded-2xl shadow-soft p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-orange-pale flex items-center justify-center flex-shrink-0"><MapPin size={16} className="text-brand-orange" /></div>
                  <div>
                    <div className="flex items-center gap-2"><span className="font-bold text-sm text-gray-800">{addr.label}</span>{addr.is_default && <Badge variant="orange" size="sm">Default</Badge>}</div>
                    <p className="text-sm text-gray-600 mt-0.5">{addr.full_name} · {addr.phone}</p>
                    <p className="text-sm text-gray-500">{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city} {addr.postal_code}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditAddr(addr)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange-pale transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDeleteAddr(addr.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {!addingAddr && (
              <button onClick={() => setAddingAddr(true)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Add New Address
              </button>
            )}

            {addingAddr && (
              <form onSubmit={handleSaveAddr} className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
                <h3 className="font-bold text-gray-800">{editAddrId ? 'Edit' : 'New'} Address</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Label" value={addrForm.label} onChange={e => setAddrForm(a => ({ ...a, label: e.target.value }))} placeholder="Home / Work" />
                  <Input label="Full Name" required value={addrForm.full_name} onChange={e => setAddrForm(a => ({ ...a, full_name: e.target.value }))} />
                  <Input label="Phone" required value={addrForm.phone} onChange={e => setAddrForm(a => ({ ...a, phone: e.target.value }))} />
                  <Input label="Address Line 1" required value={addrForm.line1} onChange={e => setAddrForm(a => ({ ...a, line1: e.target.value }))} />
                  <Input label="Address Line 2" value={addrForm.line2} onChange={e => setAddrForm(a => ({ ...a, line2: e.target.value }))} />
                  <Input label="City" required value={addrForm.city} onChange={e => setAddrForm(a => ({ ...a, city: e.target.value }))} />
                  <Input label="State" required value={addrForm.state} onChange={e => setAddrForm(a => ({ ...a, state: e.target.value }))} />
                  <Input label="Postal Code" required value={addrForm.postal_code} onChange={e => setAddrForm(a => ({ ...a, postal_code: e.target.value }))} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(a => ({ ...a, is_default: e.target.checked }))} className="accent-brand-orange" />
                  <span className="text-sm text-gray-700">Set as default address</span>
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="btn-orange">{saving ? 'Saving…' : <><Check size={14} /> Save Address</>}</button>
                  <button type="button" onClick={() => { setAddingAddr(false); setEditAddrId(null) }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {tab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleChangePassword} className="bg-white rounded-2xl shadow-soft p-8 space-y-5 max-w-sm">
              <h2 className="font-bold text-gray-800 text-lg">Change Password</h2>
              <Input label="New Password" type="password" required value={pwForm.password} onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} placeholder="Minimum 8 characters" />
              <Input label="Confirm Password" type="password" required value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
              <button type="submit" disabled={saving} className="btn-orange">{saving ? 'Updating…' : 'Update Password'}</button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}
