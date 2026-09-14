import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const isAdmin = isAuthenticated && (user.role === 'admin' || user.role === 'manager')

  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">Hotel Manager</Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/rooms" className="text-slate-300 hover:text-white">Rooms</Link>
          {isAdmin && (
            <Link to="/admin/rooms" className="text-slate-300 hover:text-white">Manage rooms</Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-slate-400">
                {user.name} <span className="rounded bg-blue-600/20 px-2 py-0.5 text-xs text-blue-300">{user.role}</span>
              </span>
              <Link to="/dashboard" className="text-blue-400 hover:underline">Dashboard</Link>
              <button onClick={logout} className="text-red-400 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
              <Link to="/register" className="rounded bg-blue-600 px-3 py-1 hover:bg-blue-700">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}