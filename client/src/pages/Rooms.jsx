import { useEffect, useState } from 'react'
import { fetchRooms } from '../services/rooms'
import RoomCard from '../components/RoomCard'
import { ROOM_TYPES, TYPE_LABELS } from '../constants/rooms'

const emptyFilters = {
  type: '',
  available: false,
  minPrice: '',
  maxPrice: '',
  capacity: '',
  search: '',
}

export default function Rooms() {
  const [filters, setFilters] = useState(emptyFilters)
  const [searchInput, setSearchInput] = useState('')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const params = {
      type: filters.type || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      capacity: filters.capacity || undefined,
      search: filters.search || undefined,
    }
    if (filters.available) params.available = 'true'

    fetchRooms(params)
      .then((res) => {
        if (!cancelled) setRooms(res.data.data.rooms)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load rooms')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filters])

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(emptyFilters)

  const clearFilters = () => {
    setFilters(emptyFilters)
    setSearchInput('')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Our Rooms</h1>
      <p className="mt-1 text-slate-400">Find the perfect room for your stay</p>

      {/* Filters */}
      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Type
            <select value={filters.type} onChange={set('type')} className="rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500">
              <option value="">All</option>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Min $/night
            <input type="number" min="0" value={filters.minPrice} onChange={set('minPrice')} placeholder="Any" className="rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Max $/night
            <input type="number" min="0" value={filters.maxPrice} onChange={set('maxPrice')} placeholder="Any" className="rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Capacity
            <input type="number" min="1" value={filters.capacity} onChange={set('capacity')} placeholder="Any" className="rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500" />
          </label>
          <label className="flex items-end gap-1 pb-2 text-xs text-slate-400">
            <input type="checkbox" checked={filters.available} onChange={(e) => setFilters((f) => ({ ...f, available: e.target.checked }))} className="h-4 w-4 accent-blue-600" />
            Available now
          </label>
          <div className="flex items-end gap-2">
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search" className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500" />
            <button onClick={() => setFilters((f) => ({ ...f, search: searchInput.trim() }))} className="rounded bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-700">Go</button>
          </div>
        </div>
        {isFiltered && (
          <button onClick={clearFilters} className="mt-3 text-xs text-slate-400 hover:text-white">Clear filters</button>
        )}
      </div>

      {/* Results */}
      {error && <p className="mt-6 rounded bg-red-500/10 p-4 text-red-400">{error}</p>}
      {loading && <p className="mt-6 text-slate-400">Loading rooms...</p>}
      {!loading && !error && rooms.length === 0 && (
        <p className="mt-6 rounded border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          No rooms match your filters.
        </p>
      )}
      {!loading && !error && rooms.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-slate-500">{rooms.length} room{rooms.length === 1 ? '' : 's'} available</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}