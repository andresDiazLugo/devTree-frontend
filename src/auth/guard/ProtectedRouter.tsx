import { Navigate, Outlet } from 'react-router-dom'
import useSession from '../hook/session'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useSession()

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />
}