import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createRoom, fetchRoom, updateRoom } from '../services/rooms'
import { ROOM_TYPES, ROOM_STATUSES, TYPE_LABELS } from '../constants/rooms'

export default function RoomForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    number: '',
    type: 'standard',
    pricePerNight: '',
    capacity: 2,
    status: 'available',
    amenities: '',
    description: '',
  })

  // edit mode: load the room and prefill
  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetchRoom(id)
      .then((res) => {
        if (cancelled) return
        const r = res.data.data.room
        setForm({
          number: r.number,
          type: r.type,
          pricePerNight: r.pricePerNight,
          capacity: r.capacity,
          status: r.status,
          amenities: (r.amenities || []).join(', '),
          description: r.description || '',
        })
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load room'))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      number: form.number.trim(),
      type: form.type,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      status: form.status,
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      description: form.description.trim(),
    }

    try {
      if (isEdit) {
        await updateRoom(id, payload)
      } else {
        await createRoom(payload)
      }
      navigate('/admin/rooms')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="p-8 text-slate-400">Loading room...</p>

  const input = 'w-full rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-blue-500'
  const label = 'mb-1 block text-sm text-slate-400'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/admin/rooms" className="text-sm text-blue-400 hover:underline">← Back to manage rooms</Link>

      <h1 className="mt-4 text-3xl font-bold">{isEdit ? `Edit room ${form.number}` : 'Add a new room'}</h1>

      {error && <p className="mt-4 rounded bg-red-500/10 p-4 text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Room number *</label>
            <input value={form.number} onChange={set('number')} required className={input} placeholder="e.g. 103" />
          </div>
          <div>
            <label className={label}>Type *</label>
            <select value={form.type} onChange={set('type')} className={input}>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={label}>Price / night *</label>
            <input type="number" min="0" step="0.01" value={form.pricePerNight} onChange={set('pricePerNight')} required className={input} placeholder="0.00" />
          </div>
          <div>
            <label className={label}>Capacity *</label>
            <input type="number" min="1" value={form.capacity} onChange={set('capacity')} required className={input} />
          </div>
          <div>
            <label className={label}>Status</label>
            <select value={form.status} onChange={set('status')} className={input}>
              {ROOM_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Amenities (comma separated)</label>
          <input value={form.amenities} onChange={set('amenities')} className={input} placeholder="WiFi, TV, Mini bar" />
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea value={form.description} onChange={set('description')} rows="3" className={input} placeholder="Room description..." />
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/admin/rooms" className="rounded border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Cancel</Link>
          <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create room'}
          </button>
        </div>
      </form>
    </div>
  )
}