import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchBookings, updateBookingStatus } from '../services/bookings'
import StatusBadge from '../components/StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'

const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function MyBookings() {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionId, setActionId] = useState(null)

  const load = () => {
    fetchBookings()
      .then((res) => setBookings(res.data.data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCancel = async (id) => {
    setActionId(id)
    try {
      await updateBookingStatus(id, 'cancelled')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Cancel failed')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <p className="mt-1 text-slate-400">All your reservations in one place</p>

      {location.state?.booked && (
        <p className="mt-4 rounded bg-emerald-500/10 p-3 text-sm text-emerald-300">
          Booking requested! It is pending until a staff member confirms it.
        </p>
      )}

      {error && <p className="mt-4 rounded bg-red-500/10 p-4 text-red-400">{error}</p>}
      {loading && <p className="mt-6 text-slate-400">Loading bookings...</p>}
      {!loading && !error && bookings.length === 0 && (
        <div className="mt-6 rounded border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">You have no bookings yet.</p>
          <Link to="/rooms" className="mt-3 inline-block text-blue-400 hover:underline">Browse rooms to book</Link>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {bookings.map((b) => {
          const nights = Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / (24 * 60 * 60 * 1000))
          const cancelable = b.status === 'pending' || b.status === 'confirmed'
          return (
            <div key={b._id} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/rooms/${b.room._id}`} className="text-lg font-bold hover:text-blue-400">
                    Room {b.room.number}
                  </Link>
                  <p className="text-sm text-slate-400">
                    {TYPE_LABELS[b.room.type] ?? b.room.type} · ${b.room.pricePerNight}/night
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-300">
                <span>{fmt(b.checkIn)} → {fmt(b.checkOut)}</span>
                <span>{nights} night{nights === 1 ? '' : 's'}</span>
                <span>{b.guests} guest{b.guests === 1 ? '' : 's'}</span>
                <span className="font-semibold text-white">${b.totalPrice}</span>
              </div>

              {cancelable && (
                <div className="mt-4">
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={actionId === b._id}
                    className="rounded border border-red-500/50 px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {actionId === b._id ? 'Cancelling...' : 'Cancel booking'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}