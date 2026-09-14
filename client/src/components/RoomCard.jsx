import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { TYPE_LABELS } from '../constants/rooms'

export default function RoomCard({ room }) {
  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/40 hover:bg-slate-800/80"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">Room {room.number}</h3>
          <p className="text-sm text-slate-400">{TYPE_LABELS[room.type] ?? room.type}</p>
        </div>
        <StatusBadge status={room.status} />
      </div>

      <p className="mb-2 text-2xl font-semibold text-white">
        ${room.pricePerNight} <span className="text-sm font-normal text-slate-500">/ night</span>
      </p>

      <p className="mb-2 text-sm text-slate-400">
        Capacity: {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
      </p>

      {room.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1 text-xs text-slate-500">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="rounded bg-slate-800 px-1.5 py-0.5">{a}</span>
          ))}
          {room.amenities.length > 3 && (
            <span className="rounded bg-slate-800 px-1.5 py-0.5">+{room.amenities.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  )
}