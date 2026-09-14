import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">This page is protected: only logged-in users can see it</p>

        <div className="mt-6 space-y-2 rounded bg-slate-800 p-4 text-sm">
          <p><span className="text-slate-400">Name:</span> {user.name}</p>
          <p><span className="text-slate-400">Email:</span> {user.email}</p>
          <p><span className="text-slate-400">Role:</span> <span className="rounded bg-blue-600/20 px-2 py-0.5 text-blue-300">{user.role}</span></p>
        </div>

        <button
          onClick={logout}
          className="mt-6 rounded bg-red-600/80 px-4 py-2 text-sm font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}