import { addDays, daysInclusive, formatShort, formatHours, todayISO } from '../lib/dates.js'
import { activeBooks, activeProjects, plannedDailyPace } from '../lib/schedule.js'
import { periodEnd } from '../data/roadmap.js'

export default function Calendar({ dateISO }) {
  const total = daysInclusive(dateISO, periodEnd)
  const days = Array.from({ length: total }, (_, i) => addDays(dateISO, i))
  const today = todayISO()

  let lastMonth = null

  return (
    <div className="view">
      <header className="view-header">
        <h1>Calendario</h1>
        <p className="muted">Ritmo planeado (horas totales del libro repartidas parejo en su ventana).</p>
      </header>
      <div className="table-wrap">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Libro</th>
              <th>Ritmo/día</th>
              <th>Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => {
              const bs = activeBooks(d)
              const ps = activeProjects(d)
              const month = d.slice(0, 7)
              const showMonthHeader = month !== lastMonth
              lastMonth = month
              return (
                <DayRow key={d} d={d} showMonthHeader={showMonthHeader} bs={bs} ps={ps} isToday={d === today} />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const MES_LABEL = {
  '2026-08': 'Agosto 2026',
  '2026-09': 'Septiembre 2026',
  '2026-10': 'Octubre 2026',
  '2026-11': 'Noviembre 2026',
  '2026-12': 'Diciembre 2026',
}

function DayRow({ d, showMonthHeader, bs, ps, isToday }) {
  return (
    <>
      {showMonthHeader && (
        <tr className="month-row">
          <td colSpan={4}>{MES_LABEL[d.slice(0, 7)] || d.slice(0, 7)}</td>
        </tr>
      )}
      <tr className={isToday ? 'today-row' : ''}>
        <td>{formatShort(d)}{isToday ? ' (hoy)' : ''}</td>
        <td>{bs.map((b) => b.title).join(', ') || '—'}</td>
        <td>{bs.map((b) => formatHours(plannedDailyPace(b))).join(', ') || '—'}</td>
        <td>{ps.map((p) => p.title).join(', ') || '—'}</td>
      </tr>
    </>
  )
}
