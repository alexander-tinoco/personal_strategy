import { useState } from 'react'
import { formatHuman, formatHours, daysInclusive } from '../lib/dates.js'
import { remainingHoursFor, plannedDailyPace } from '../lib/schedule.js'

function ProgressInput({ book, currentLogged, onSet }) {
  const [value, setValue] = useState(String(currentLogged || 0))

  return (
    <form
      className="log-form"
      onSubmit={(e) => {
        e.preventDefault()
        const n = parseFloat(value.replace(',', '.'))
        if (!Number.isNaN(n) && n >= 0) onSet(book.id, n)
      }}
    >
      <label className="progress-input-label">
        Horas leídas hasta ahora:
        <input
          type="number"
          step="0.1"
          min="0"
          max={book.hours ?? undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button type="submit">Actualizar progreso</button>
    </form>
  )
}

export default function Books({ state, dateISO, bookSchedule, setHours, markBookCompleted, unmarkBookCompleted }) {
  return (
    <div className="view">
      <header className="view-header">
        <h1>Libros</h1>
        <p className="muted">9 libros, en orden de lectura. Duraciones verificadas en Audible (ago 2026). Poné cuánto llevás leído para actualizar la barra de progreso.</p>
      </header>
      {bookSchedule.map(({ book: b, dynStart, dynEnd, isCompleted, isOverdue, shiftedFromPlan }) => {
        const remaining = remainingHoursFor(b, state.loggedHours)
        const logged = b.hours ? b.hours - remaining : 0
        const progress = b.hours ? Math.min(100, Math.round((logged / b.hours) * 100)) : 0
        return (
          <div className="card" key={b.id}>
            <div className="card-title-row">
              <h3>#{b.order} {b.title}</h3>
              <span className="tag">{formatHuman(dynStart)} → {formatHuman(dynEnd)}</span>
            </div>
            <p className="muted">{b.author} · {b.why}</p>
            {(dynStart !== b.start || dynEnd !== b.end) && (
              <p className="note">Plan original: {formatHuman(b.start)} → {formatHuman(b.end)}</p>
            )}
            {isCompleted && <p className="note ok">✓ Terminado.</p>}
            {!isCompleted && isOverdue && <p className="note warn">⚠ Atrasado respecto al plan original — esto corrió el resto del calendario.</p>}
            {!isCompleted && !isOverdue && shiftedFromPlan && <p className="note ok">🟢 Adelantado respecto al plan original.</p>}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="stat-label">{progress}% completado</p>
            <div className="stat-row">
              <div>
                <span className="stat-value">{formatHours(b.hours)}</span>
                <span className="stat-label">{b.hoursIsRemaining ? 'restantes (hoy)' : 'total'}</span>
              </div>
              <div>
                <span className="stat-value">{daysInclusive(b.start, b.end)}</span>
                <span className="stat-label">días planeados</span>
              </div>
              <div>
                <span className="stat-value">{formatHours(plannedDailyPace(b))}</span>
                <span className="stat-label">ritmo planeado/día</span>
              </div>
              <div>
                <span className="stat-value">{formatHours(remaining)}</span>
                <span className="stat-label">restantes hoy</span>
              </div>
            </div>
            <ProgressInput book={b} currentLogged={state.loggedHours[b.id] || 0} onSet={setHours} />
            <div className="row-actions">
              {!isCompleted ? (
                <button className="ghost-btn" onClick={() => markBookCompleted(b.id, dateISO)}>✓ Marcar como terminado</button>
              ) : (
                <button className="ghost-btn" onClick={() => unmarkBookCompleted(b.id)}>Deshacer</button>
              )}
            </div>
            <p className="note">{b.source}</p>
            {b.densest && <p className="note">⚠ Libro más denso del roadmap — si se atrasa, está bien que se extienda.</p>}
          </div>
        )
      })}
    </div>
  )
}
