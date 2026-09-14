import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Home() {
  const [status, setStatus] = useState('CHECKING')
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    api
      .get('/api/health')
      .then((res) => {
        if (mounted) setStatus(res.data.success ? 'CONNECTED' : 'OFFLINE')
      })
      .catch((err) => {
        if (mounted) {
          setStatus('OFFLINE')
          setError(err.message)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="mb-2 text-4xl font-bold">Hotel Management System</h1>
      <p className="mb-4 text-slate-400">Frontend is running</p>

      {status === 'CHECKING' && <p className="text-yellow-400">Checking backend...</p>}
      {status === 'CONNECTED' && <p className="text-green-400">Backend Status: Connected</p>}
      {status === 'OFFLINE' && (
        <p className="text-red-400">
          Backend Status: Offline{' '}
          {error && <span className="text-slate-500">({error})</span>}
        </p>
      )}
    </div>
  )
}