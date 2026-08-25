import { formatHuman, formatHours, daysInclusive } from '../lib/dates.js'
import { activeCerts, activeEntriesOn, remainingHoursFor, liveDailyPace } from '../lib/schedule.js'
import { periodEnd } from '../data/roadmap.js'
import HoursLogger from './HoursLogger.jsx'

export default function Today({
  dateISO,
  state,
  bookSchedule,
  projectSchedule,
  logHours,
  toggleRequirement,
  markBookCompleted,
  markProjectCompleted,
}) {
  const bookEntries = activeEntriesOn(dateISO, bookSchedule)
  const projectEntries = activeEntriesOn(dateISO, projectSchedule)
  const cts = activeCerts(dateISO)
  const daysLeftTotal = daysInclusive(dateISO, periodEnd)

  return (
    <div className="view">
      <header className="view-header">
        <h1>Hoy · {formatHuman(dateISO)}</h1>
        <p className="muted">{daysLeftTotal} días restantes hasta el 31 de diciembre.</p>
      </header>

      <section>
        <h2>Lectura</h2>
        {bookEntries.length === 0 && <p className="muted">No hay un libro asignado a esta fecha.</p>}
        {bookEntries.map(({ book, dynEnd, isOverdue, shiftedFromPlan }) => {
          const remaining = remainingHoursFor(book, state.loggedHours)
          const pace = liveDailyPace(remaining, dateISO, dynEnd)
          return (
            <div className="card" key={book.id}>
              <div className="card-title-row">
                <h3>{book.title}</h3>
                <span className="tag">{book.author}</span>
              </div>
              <p className="muted">{book.why}</p>
              {isOverdue && <p className="note warn">⚠ Vas atrasado respecto al plan original — el resto del roadmap se corrió en consecuencia.</p>}
              {!isOverdue && shiftedFromPlan && <p className="note ok">🟢 Vas adelantado respecto al plan original.</p>}
              <div className="stat-row">
                <div>
                  <span className="stat-value">{formatHours(pace)}</span>
                  <span className="stat-label">a leer hoy</span>
                </div>
                <div>
                  <span className="stat-value">{formatHours(remaining)}</span>
                  <span className="stat-label">restantes</span>
                </div>
                <div>
                  <span className="stat-value">{formatHours(book.hours)}</span>
                  <span className="stat-label">total {book.hoursIsRemaining ? '(desde hoy)' : ''}</span>
                </div>
              </div>
              <div className="row-actions">
                <HoursLogger book={book} remaining={remaining} onLog={logHours} />
                <button className="ghost-btn" onClick={() => markBookCompleted(book.id, dateISO)}>
                  ✓ Terminé este libro hoy
                </button>
              </div>
            </div>
          )
        })}
      </section>

      <section>
        <h2>Proyecto activo</h2>
        {projectEntries.length === 0 && <p className="muted">No hay proyecto asignado a esta fecha.</p>}
        {projectEntries.map(({ project: p, isCompleted, isOverdue, shiftedFromPlan }) => {
          const doneCount = p.requirements.filter((_, i) => state.checkedRequirements[`${p.id}:${i}`]).length
          return (
            <div className="card" key={p.id}>
              <h3>{p.title}</h3>
              <p className="muted">{p.objetivo}</p>
              {isCompleted && <p className="note ok">✓ Marcado como completo.</p>}
              {!isCompleted && isOverdue && <p className="note warn">⚠ Atrasado respecto al plan original.</p>}
              {!isCompleted && !isOverdue && shiftedFromPlan && <p className="note ok">🟢 Adelantado respecto al plan original.</p>}
              <p className="stat-label">{doneCount}/{p.requirements.length} requisitos cumplidos</p>
              <ul className="checklist">
                {p.requirements.map((req, i) => {
                  const key = `${p.id}:${i}`
                  const checked = !!state.checkedRequirements[key]
                  return (
                    <li key={key}>
                      <label>
                        <input type="checkbox" checked={checked} onChange={() => toggleRequirement(key)} />
                        <span className={checked ? 'done' : ''}>{req}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
              {p.note && <p className="note">{p.note}</p>}
              {!isCompleted && (
                <button className="ghost-btn" onClick={() => markProjectCompleted(p.id, dateISO)}>
                  ✓ Terminé este proyecto hoy
                </button>
              )}
            </div>
          )
        })}
      </section>

      {cts.length > 0 && (
        <section>
          <h2>Certificación en curso</h2>
          {cts.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.title}</h3>
              <p className="muted">{c.note}</p>
              {c.examDate && <p className="tag">Examen: {formatHuman(c.examDate)}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
