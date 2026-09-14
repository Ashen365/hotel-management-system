import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Blocks a route by role.
// Usage: <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin','manager']}><Admin/></RoleProtectedRoute>} />
export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="p-8 text-slate-400">Checking session...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}