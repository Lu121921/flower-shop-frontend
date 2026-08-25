import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading fullScreen text="Verifying authentication…" />
  if (!user)   return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  return children
}
