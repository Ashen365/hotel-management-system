import { STATUS_STYLES } from '../constants/rooms'

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-slate-600/30 text-slate-400'}`}>
      {status}
    </span>
  )
}