import { formatHuman, formatHours, daysInclusive } from '../lib/dates.js'
import { activeEntriesOn, remainingHoursFor, todaysTarget } from '../lib/schedule.js'
import { periodEnd, dailyBudgets } from '../data/roadmap.js'
import HoursLogger from './HoursLogger.jsx'

export default function Today({
  dateISO,
  state,
  bookSchedule,
  courseSchedule,
  projectSchedule,
  logHours,
  toggleRequirement,
  markBookCompleted,
  markCourseCompleted,
  markProjectCompleted,
}) {
  const bookEntries = activeEntriesOn(dateISO, bookSchedule)
  const courseEntries = activeEntriesOn(dateISO, courseSchedule)
  const projectEntries = activeEntriesOn(dateISO, projectSchedule)
  const daysLeftTotal = daysInclusive(dateISO, periodEnd)

  return (
    <div className="view">
      <header className="view-header">
        <h1>Hoy · {formatHuman(dateISO)}</h1>
        <p className="muted">{daysLeftTotal} días restantes hasta el 31 de diciembre · meta diaria: {dailyBudgets.reading}h lectura + {dailyBudgets.course}h curso + {dailyBudgets.dev}h desarrollo.</p>
      </header>

      <section>
        <h2>Lectura</h2>
        {bookEntries.length === 0 && <p className="muted">No hay un libro asignado a esta fecha.</p>}
        {bookEntries.map(({ book, isOverdue, isCompleted, isAhead }) => {
          const remaining = remainingHoursFor(book, state.loggedHours)
          const target = todaysTarget(remaining, dailyBudgets.reading)
          return (
            <div className="card" key={book.id}>
              <div className="card-title-row">
                <h3>{book.title}</h3>
                <span className="tag">{book.author}</span>
              </div>
              <p className="muted">{book.why}</p>
              {isOverdue && <p className="note warn">⚠ Vas atrasado respecto al ritmo de {dailyBudgets.reading}h/día — el resto del roadmap se corrió en consecuencia.</p>}
              {isCompleted && isAhead && <p className="note ok">🟢 Lo terminaste antes de lo estimado.</p>}
              <div className="stat-row">
                <div>
                  <span className="stat-value">{formatHours(target)}</span>
                  <span className="stat-label">meta de hoy</span>
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
        <h2>Curso</h2>
        {courseEntries.length === 0 && <p className="muted">No hay curso asignado a esta fecha.</p>}
        {courseEntries.map(({ cert, isOverdue, isCompleted, isAhead }) => {
          const remaining = remainingHoursFor(cert, state.loggedHours)
          const target = todaysTarget(remaining, dailyBudgets.course)
          return (
            <div className="card" key={cert.id}>
              <h3>{cert.title}</h3>
              <p className="muted">{cert.note}</p>
              {isOverdue && <p className="note warn">⚠ Vas atrasado respecto al ritmo de {dailyBudgets.course}h/día.</p>}
              {isCompleted && isAhead && <p className="note ok">🟢 Lo terminaste antes de lo estimado.</p>}
              <div className="stat-row">
                <div>
                  <span className="stat-value">{formatHours(target)}</span>
                  <span className="stat-label">meta de hoy</span>
                </div>
                <div>
                  <span className="stat-value">{formatHours(remaining)}</span>
                  <span className="stat-label">restantes</span>
                </div>
                <div>
                  <span className="stat-value">{formatHours(cert.hours)}</span>
                  <span className="stat-label">total</span>
                </div>
              </div>
              <div className="row-actions">
                <HoursLogger book={cert} remaining={remaining} onLog={logHours} />
                <button className="ghost-btn" onClick={() => markCourseCompleted(cert.id, dateISO)}>
                  ✓ Terminé este curso hoy
                </button>
              </div>
            </div>
          )
        })}
      </section>

      <section>
        <h2>Desarrollo · meta {dailyBudgets.dev}h/día</h2>
        {projectEntries.length === 0 && <p className="muted">No hay proyecto asignado a esta fecha.</p>}
        {projectEntries.map(({ project: p, isCompleted, isOverdue, isAhead }) => {
          const doneCount = p.requirements.filter((_, i) => state.checkedRequirements[`${p.id}:${i}`]).length
          return (
            <div className="card" key={p.id}>
              <h3>{p.title}</h3>
              <p className="muted">{p.objetivo}</p>
              {isCompleted && <p className="note ok">✓ Marcado como completo.</p>}
              {!isCompleted && isOverdue && <p className="note warn">⚠ Atrasado respecto al plan original.</p>}
              {isCompleted && isAhead && <p className="note ok">🟢 Adelantado respecto al plan original.</p>}
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
    </div>
  )
}
