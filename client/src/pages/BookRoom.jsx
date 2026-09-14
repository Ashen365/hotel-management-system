import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchRoom } from '../services/rooms'
import { createBooking } from '../services/bookings'
import StatusBadge from '../components/StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export default function BookRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [roomError, setRoomError] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchRoom(id)
      .then((res) => {
        if (!cancelled) {
          setRoom(res.data.data.room)
          setGuests(1)
        }
      })
      .catch((err) => {
        if (!cancelled) setRoomError(err.response?.data?.message || 'Room not found')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // min check-out = the day after check-in
  const minOut = checkIn ? new Date(new Date(checkIn).getTime() + MS_PER_DAY).toISOString().split('T')[0] : today

  const nights = checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
    ? Math.round((new Date(checkOut) - new Date(checkIn)) / MS_PER_DAY)
    : 0
  const total = room && nights > 0 ? room.pricePerNight * nights : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await createBooking({ roomId: id, checkIn, checkOut, guests })
      navigate('/bookings', { state: { booked: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="p-8 text-slate-400">Loading room...</p>
  if (roomError) {
    return (
      <p className="p-8 text-red-400">
        {roomError} — <Link to="/rooms" className="text-blue-400 hover:underline">back to rooms</Link>
      </p>
    )
  }

  const input = 'w-full rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-blue-500'
  const label = 'mb-1 block text-sm text-slate-400'

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to={`/rooms/${id}`} className="text-sm text-blue-400 hover:underline">← Room {room.number}</Link>
      <h1 className="mt-3 text-3xl font-bold">Book Room {room.number}</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Room summary */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold">Room {room.number}</h2>
              <p className="mt-1 text-sm text-slate-400">{TYPE_LABELS[room.type] ?? room.type} · sleeps {room.capacity}</p>
            </div>
            <StatusBadge status={room.status} />
          </div>
          <p className="mt-4 text-3xl font-bold">
            ${room.pricePerNight} <span className="text-sm font-normal text-slate-500">/ night</span>
          </p>
          {room.description && <p className="mt-3 text-sm text-slate-400">{room.description}</p>}
          {room.status === 'maintenance' && (
            <p className="mt-4 rounded bg-red-500/10 p-3 text-sm text-red-400">
              This room is under maintenance and cannot be booked.
            </p>
          )}
        </div>

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          {error && <p className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className={label}>Check-in</label>
              <input type="date" min={today} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setCheckOut('') }} required className={input} />
            </div>
            <div>
              <label className={label}>Check-out</label>
              <input type="date" min={minOut} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required disabled={!checkIn} className={input} />
            </div>
            <div>
              <label className={label}>Guests (max {room.capacity})</label>
              <input type="number" min="1" max={room.capacity} value={guests} onChange={(e) => setGuests(Number(e.target.value))} required className={input} />
            </div>
          </div>

          <div className="my-4 border-t border-slate-800" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {nights > 0 ? `${nights} night${nights === 1 ? '' : 's'} × $${room.pricePerNight}` : 'Select dates'}
            </span>
            <span className="text-2xl font-bold">${total}</span>
          </div>

          <button
            type="submit"
            disabled={submitting || nights === 0 || room.status === 'maintenance'}
            className="mt-5 w-full rounded bg-blue-600 p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Booking...' : nights > 0 ? `Book for $${total}` : 'Select dates to book'}
          </button>
        </form>
      </div>
    </div>
  )
}