export const ROOM_TYPES = [
  'standard',
  'deluxe',
  'suite',
  'family',
  'executive',
  'presidential',
  'villa',
]

export const TYPE_LABELS = Object.fromEntries(
  ROOM_TYPES.map((t) => [t, t.charAt(0).toUpperCase() + t.slice(1)])
)

export const ROOM_STATUSES = ['available', 'occupied', 'reserved', 'maintenance']

export const STATUS_STYLES = {
  // room statuses
  available: 'bg-emerald-500/20 text-emerald-300',
  occupied: 'bg-amber-500/20 text-amber-300',
  reserved: 'bg-blue-500/20 text-blue-300',
  maintenance: 'bg-red-500/20 text-red-300',
  // booking statuses
  pending: 'bg-amber-500/20 text-amber-300',
  confirmed: 'bg-emerald-500/20 text-emerald-300',
  completed: 'bg-slate-500/20 text-slate-400',
  cancelled: 'bg-red-500/20 text-red-400',
  // housekeeping task statuses
  in_progress: 'bg-indigo-500/20 text-indigo-300',
}

export const HOUSEKEEPING_STATUSES = ['pending', 'in_progress', 'completed']