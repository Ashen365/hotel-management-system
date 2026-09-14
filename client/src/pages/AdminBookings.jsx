import { useEffect, useState } from 'react'
import { fetchBookings, updateBookingStatus } from '../services/bookings'
import StatusBadge from '../components/StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'

const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [actionId, setActionId] = useState(null)
  const [actionStatus, setActionStatus] = useState(null)

  const load = () => {
    setLoading(true)
    fetchBookings(filter ? { status: filter } : {})
      .then((res) => setBookings(res.data.data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  const handleStatus = async (id, status) => {
    setActionId(id)
    setActionStatus(status)
    try {
      await updateBookingStatus(id, status)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setActionId(null)
      setActionStatus(null)
    }
  }

  const transitions = (status) => {
    if (status === 'pending') return ['confirmed', 'cancelled']
    if (status === 'confirmed') return ['completed', 'cancelled']
    return []
  }

  const nights = (b) => Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / (24 * 60 * 60 * 1000))

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Bookings</h1>
          <p className="mt-1 text-slate-400">Manage the full reservation book (staff)</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <p className="mt-6 rounded bg-red-500/10 p-4 text-red-400">{error}</p>}
      {loading && <p className="mt-6 text-slate-400">Loading bookings...</p>}
      {!loading && !error && bookings.length === 0 && (
        <p className="mt-6 rounded border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">No bookings.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr className="border-b border-slate-800">
                <th className="p-3">Room</th>
                <th className="p-3">Guest</th>
                <th className="p-3">Dates</th>
                <th className="p-3">$/night</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40">
                  <td className="p-3">
                    <span className="font-medium">{b.room.number}</span>
                    <span className="ml-1 text-xs text-slate-500 capitalize">{TYPE_LABELS[b.room.type] ?? b.room.type}</span>
                  </td>
                  <td className="p-3">{b.user.name} <span className="text-xs text-slate-500">{b.user.email}</span></td>
                  <td className="p-3 text-xs">
                    {fmt(b.checkIn)} → {fmt(b.checkOut)}
                    <span className="text-slate-500"> · {nights(b)}n · {b.guests}g · ${b.totalPrice}</span>
                  </td>
                  <td className="p-3">${b.room.pricePerNight}</td>
                  <td className="p-3"><StatusBadge status={b.status} /></td>
                  <td className="p-3 text-right">
                    {transitions(b.status).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(b._id, s)}
                        disabled={actionId === b._id}
                        className={`ml-2 rounded px-2 py-1 text-xs font-medium disabled:opacity-50 ${
                          s === 'cancelled'
                            ? 'border border-red-500/50 text-red-400 hover:bg-red-500/10'
                            : 'border border-blue-500/50 text-blue-300 hover:bg-blue-500/10'
                        }`}
                      >
                        {actionId === b._id && actionStatus === s ? '...' : s}
                      </button>
                    ))}
                    {transitions(b.status).length === 0 && <span className="text-xs text-slate-600">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}