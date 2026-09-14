import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteRoom, fetchRooms } from '../services/rooms'
import StatusBadge from '../components/StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    fetchRooms()
      .then((res) => setRooms(res.data.data.rooms))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load rooms'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete room ${room.number}? This cannot be undone.`)) return
    setDeletingId(room._id)
    try {
      await deleteRoom(room._id)
      setRooms((rs) => rs.filter((r) => r._id !== room._id))
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Rooms</h1>
          <p className="mt-1 text-slate-400">Full control over the room catalog (admin / manager)</p>
        </div>
        <Link to="/admin/rooms/new" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700">
          + Add room
        </Link>
      </div>

      {error && <p className="mt-6 rounded bg-red-500/10 p-4 text-red-400">{error}</p>}
      {loading && <p className="mt-6 text-slate-400">Loading rooms...</p>}
      {!loading && !error && rooms.length === 0 && (
        <p className="mt-6 rounded border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          No rooms yet.
        </p>
      )}
      {!loading && !error && rooms.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr className="border-b border-slate-800">
                <th className="p-3">Number</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price/night</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40">
                  <td className="p-3 font-medium">{room.number}</td>
                  <td className="p-3 capitalize">{TYPE_LABELS[room.type] ?? room.type}</td>
                  <td className="p-3">${room.pricePerNight}</td>
                  <td className="p-3">{room.capacity}</td>
                  <td className="p-3"><StatusBadge status={room.status} /></td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/rooms/${room._id}/edit`} className="mr-3 text-blue-400 hover:underline">Edit</Link>
                    <button
                      onClick={() => handleDelete(room)}
                      disabled={deletingId === room._id}
                      className="text-red-400 hover:underline disabled:opacity-50"
                    >
                      {deletingId === room._id ? 'Deleting...' : 'Delete'}
                    </button>
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