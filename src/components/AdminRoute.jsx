import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from './Loading'

export default function AdminRoute({ children }) {
  const { profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading fullScreen text="Checking admin access…" />
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location.pathname }} replace />
  }

  return children
}
