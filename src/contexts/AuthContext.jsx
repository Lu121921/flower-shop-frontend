import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) await loadProfile(session.user.id)
      else setProfile(null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: metadata },
    })
    if (error) { toast.error(error.message); return { data: null, error } }
    toast.success('Account created! Please verify your email.')
    return { data, error: null }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message || 'Invalid credentials'); return { data: null, error } }
    // Store token for axios interceptor
    if (data.session) localStorage.setItem('access_token', data.session.access_token)
    toast.success(`Welcome back${data.user?.user_metadata?.full_name ? ', ' + data.user.user_metadata.full_name : ''}!`)
    return { data, error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('access_token')
    setProfile(null)
    toast.success('Signed out')
    return { error: null }
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { toast.error(error.message); return { error } }
    toast.success('Password reset email sent!')
    return { error: null }
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { toast.error(error.message); return { error } }
    toast.success('Password updated')
    return { error: null }
  }

  const refreshProfile = () => user && loadProfile(user.id)

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      signUp, signIn, signOut, resetPassword, updatePassword, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
