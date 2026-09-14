import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchRoom } from '../services/rooms'
import StatusBadge from '../components/StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'

export default function RoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchRoom(id)
      .then((res) => {
        if (!cancelled) setRoom(res.data.data.room)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Room not found')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <p className="p-8 text-slate-400">Loading room...</p>
  if (error) {
    return (
      <p className="p-8 text-red-400">
        {error} — <Link to="/rooms" className="text-blue-400 hover:underline">back to rooms</Link>
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/rooms" className="text-sm text-blue-400 hover:underline">← All rooms</Link>

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Room {room.number}</h1>
            <p className="mt-1 text-slate-400">{TYPE_LABELS[room.type] ?? room.type} · {room.capacity} guests</p>
          </div>
          <StatusBadge status={room.status} />
        </div>

        <p className="mt-4 text-4xl font-bold text-white">
          ${room.pricePerNight} <span className="text-base font-normal text-slate-500">per night</span>
        </p>

        {room.description && (
          <p className="mt-4 text-slate-300">{room.description}</p>
        )}

        <h2 className="mt-6 mb-2 text-lg font-semibold">Amenities</h2>
        {room.amenities.length === 0 ? (
          <p className="text-sm text-slate-500">No amenities listed</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <li key={a} className="rounded bg-slate-800 px-3 py-2 text-sm">{a}</li>
            ))}
          </ul>
        )}

        <Link
          to={`/rooms/${room._id}/book`}
          className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700"
        >
          Book this room
        </Link>
      </div>
    </div>
  )
}