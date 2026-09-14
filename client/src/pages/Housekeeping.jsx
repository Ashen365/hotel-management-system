import { useEffect, useMemo, useState } from 'react'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchToClean,
  fetchUsers,
} from '../services/housekeeping'
import { fetchRooms } from '../services/rooms'
import StatusBadge from '../components/StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'
import { useAuth } from '../context/AuthContext'

const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function Housekeeping() {
  const { user } = useAuth()
  const isManager = user.role === 'admin' || user.role === 'manager'

  const [tasks, setTasks] = useState([])
  const [toClean, setToClean] = useState([])
  const [rooms, setRooms] = useState([])
  const [housekeepers, setHousekeepers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [actionId, setActionId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState(null)
  const [form, setForm] = useState({ roomId: '', assignedTo: '', notes: '', dueDate: '' })

  const load = () => {
    setLoading(true)
    Promise.all([
      fetchTasks(filter ? { status: filter } : {}),
      fetchToClean(),
      fetchRooms({ status: 'available' }),
      fetchUsers({ role: 'housekeeping' }),
    ])
      .then(([t, c, r, u]) => {
        setTasks(t.data.data.tasks)
        setToClean(c.data.data.rooms)
        setRooms(r.data.data.rooms)
        setHousekeepers(u.data.data.users)
        setError(null)
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load housekeeping data'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  const handleTask = async (id, status) => {
    setActionId(id)
    try {
      await updateTask(id, { status })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteTask(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const openCreate = (roomId = '') => {
    setForm({ roomId, assignedTo: '', notes: '', dueDate: new Date().toISOString().slice(0, 10) })
    setFormError(null)
    setOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.roomId) {
      setFormError('Pick a room')
      return
    }
    setCreating(true)
    try {
      await createTask({
        roomId: form.roomId,
        assignedTo: form.assignedTo || undefined,
        notes: form.notes || undefined,
        dueDate: form.dueDate || undefined,
      })
      setOpen(false)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  const counts = useMemo(() => {
    const c = { pending: 0, in_progress: 0, completed: 0 }
    for (const t of tasks) c[t.status] = (c[t.status] || 0) + 1
    return c
  }, [tasks])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <p className="mt-1 text-slate-400">Cleaning queue and task board (staff)</p>
        </div>
        <button
          onClick={() => openCreate()}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          + New task
        </button>
      </div>

      {/* stat chips */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['To clean', toClean.length, 'text-amber-300'],
          ['Pending', counts.pending || 0, 'text-amber-300'],
          ['In progress', counts.in_progress || 0, 'text-indigo-300'],
          ['Completed', counts.completed || 0, 'text-emerald-300'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {error && <p className="mt-6 rounded bg-red-500/10 p-4 text-red-400">{error}</p>}

      {/* to-clean queue */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">To clean today</h2>
        {loading ? (
          <p className="mt-4 text-slate-400">Loading...</p>
        ) : toClean.length === 0 ? (
          <p className="mt-4 rounded border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
            All clear — no checkouts left uncleaned.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {toClean.map((room) => (
              <div
                key={room._id}
                className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-slate-900 p-4"
              >
                <div>
                  <p className="font-semibold">
                    Room {room.number} <span className="text-xs capitalize text-slate-500">{TYPE_LABELS[room.type] ?? room.type}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">Status: <StatusBadge status={room.status} /></p>
                </div>
                <button
                  onClick={() => openCreate(room._id)}
                  className="rounded border border-blue-500/50 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/10"
                >
                  + Task
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* task list */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <p className="mt-4 text-slate-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="mt-4 rounded border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">No tasks.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {tasks.map((t) => (
              <div key={t._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    Room {t.room.number} <span className="text-xs capitalize text-slate-500">{TYPE_LABELS[t.room.type] ?? t.room.type}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {t.assignedTo ? `→ ${t.assignedTo.name}` : 'Unassigned'}
                    {t.notes && <span className="text-slate-500"> · “{t.notes}”</span>}
                    {' · '}due {fmt(t.dueDate)}
                    {t.completedAt && <span className="text-slate-500"> · done {fmt(t.completedAt)}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  {t.status !== 'completed' && (
                    <button
                      onClick={() => handleTask(t._id, 'in_progress')}
                      disabled={t.status === 'in_progress' || actionId === t._id}
                      className="rounded border border-indigo-500/50 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-50"
                    >
                      {t.status === 'pending' ? 'Start' : 'Working'}
                    </button>
                  )}
                  {t.status !== 'completed' && (
                    <button
                      onClick={() => handleTask(t._id, 'completed')}
                      disabled={actionId === t._id}
                      className="rounded border border-emerald-500/50 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      Complete
                    </button>
                  )}
                  {isManager && (
                    <button
                      onClick={() => handleDelete(t._id)}
                      disabled={deletingId === t._id}
                      className="rounded border border-red-500/50 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* create task modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">New cleaning task</h3>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Room</label>
                <select
                  value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">— Pick a room —</option>
                  {[...toClean, ...rooms.filter((r) => !toClean.some((c) => c._id === r._id))].map((room) => (
                    <option key={room._id} value={room._id}>
                      Room {room.number} · {TYPE_LABELS[room.type] ?? room.type}
                      {toClean.some((c) => c._id === room._id) ? ' · needs cleaning' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Assign to (optional)</label>
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {housekeepers.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Due date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Notes (optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. restock minibar, deep clean"
                  className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              {formError && <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{formError}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}