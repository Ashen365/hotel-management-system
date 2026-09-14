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
  available: 'bg-emerald-500/20 text-emerald-300',
  occupied: 'bg-amber-500/20 text-amber-300',
  reserved: 'bg-blue-500/20 text-blue-300',
  maintenance: 'bg-red-500/20 text-red-300',
}