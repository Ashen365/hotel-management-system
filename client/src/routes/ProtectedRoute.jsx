import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Blocks a route for anonymous users.
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="p-8 text-slate-400">Checking session...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}