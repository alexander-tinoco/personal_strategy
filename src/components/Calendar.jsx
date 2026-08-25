import { useState } from 'react'
import { monthKey, addMonths, monthLabel, buildMonthGrid, todayISO, formatHuman, formatHours } from '../lib/dates.js'
import { certs, periodStart, periodEnd } from '../data/roadmap.js'
import {
  buildDynamicSchedule,
  activeScheduleEntries,
  activeProjectsOn,
  activeCerts,
  remainingHoursFor,
  liveDailyPace,
} from '../lib/schedule.js'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const SHORT_BOOK = {
  'ai-engineering': 'AI Eng.',
  'clean-code': 'Clean Code',
  'pragmatic-programmer': 'Pragmatic',
  'clean-architecture': 'Clean Arch.',
  'hard-parts': 'Hard Parts',
  'building-microservices': 'Microservicios',
  ddia: 'DDIA',
  'data-engineering-fundamentals': 'Data Eng.',
  'designing-ml-systems': 'ML Systems',
}

const SHORT_PROJECT = {
  'rag-assistant': 'Proy: RAG',
  'refactor-project': 'Proy: Refactor',
  'cli-tool': 'Proy: CLI',
  'layered-app': 'Proy: Capas',
  'adr-prototype': 'Proy: ADR',
  'microservices-split': 'Proy: Microservicios',
  'replication-pipeline': 'Proy: Replicación',
  'etl-pipeline': 'Proy: ETL',
  'ml-serving': 'Proy: ML Serving',
  'databricks-pipeline': 'Proy: Databricks',
  'k8s-deploy': 'Proy: K8s',
  'gcp-deploy': 'Proy: GCP',
}

function DayCell({ iso, entries, dayProjects, exam, isSelected, onSelect }) {
  if (!iso) return <td className="cal-cell empty" />
  const today = iso === todayISO()
  const inWindow = iso >= periodStart && iso <= periodEnd
  const dayNum = Number(iso.slice(8, 10))

  return (
    <td
      className={`cal-cell${today ? ' is-today' : ''}${inWindow ? '' : ' outside'}${isSelected ? ' is-selected' : ''}`}
      onClick={() => onSelect(iso)}
    >
      <div className="cal-daynum">{dayNum}</div>
      <div className="cal-tags">
        {entries.map(({ book, isCompleted, isOverdue }) => (
          <span key={book.id} className={`cal-tag cal-book-${book.order}${isCompleted ? ' cal-done' : ''}${isOverdue ? ' cal-overdue' : ''}`}>
            {SHORT_BOOK[book.id] || book.title}
          </span>
        ))}
        {dayProjects.map((p) => (
          <span key={p.id} className="cal-tag cal-project">
            {SHORT_PROJECT[p.id] || p.title}
          </span>
        ))}
        {exam && <span className="cal-tag cal-exam">🎯 Examen {exam.title.split(' ')[0]}</span>}
      </div>
    </td>
  )
}

function DayDetail({ iso, entries, dayProjects, cts, state, toggleRequirement, markBookCompleted, unmarkBookCompleted, onClose }) {
  return (
    <div className="day-detail">
      <div className="day-detail-header">
        <h3>{formatHuman(iso)}</h3>
        <button className="ghost-btn" onClick={onClose}>Cerrar ✕</button>
      </div>

      {entries.length === 0 && dayProjects.length === 0 && cts.length === 0 && (
        <p className="muted">No hay nada planeado para este día.</p>
      )}

      {entries.map(({ book, dynEnd, isCompleted, isOverdue }) => {
        const remaining = remainingHoursFor(book, state.loggedHours)
        const pace = liveDailyPace(remaining, iso, dynEnd)
        return (
          <div className="card" key={book.id}>
            <div className="card-title-row">
              <h3>{book.title}</h3>
              <span className="tag">{book.author}</span>
            </div>
            <p className="muted">{book.why}</p>
            {isOverdue && <p className="note warn">⚠ Atrasado respecto al plan original.</p>}
            {isCompleted && <p className="note ok">✓ Marcado como terminado.</p>}
            <div className="stat-row">
              <div>
                <span className="stat-value">{formatHours(pace)}</span>
                <span className="stat-label">ritmo ese día</span>
              </div>
              <div>
                <span className="stat-value">{formatHours(remaining)}</span>
                <span className="stat-label">restantes</span>
              </div>
              <div>
                <span className="stat-value">{formatHours(book.hours)}</span>
                <span className="stat-label">{book.hoursIsRemaining ? 'restantes (hoy)' : 'total'}</span>
              </div>
            </div>
            {!isCompleted ? (
              <button className="ghost-btn" onClick={() => markBookCompleted(book.id, iso)}>✓ Terminé este libro este día</button>
            ) : (
              <button className="ghost-btn" onClick={() => unmarkBookCompleted(book.id)}>Deshacer</button>
            )}
          </div>
        )
      })}

      {dayProjects.map((p) => (
        <div className="card" key={p.id}>
          <h3>{p.title}</h3>
          <p className="muted">{p.objetivo}</p>
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
        </div>
      ))}

      {cts.map((c) => (
        <div className="card" key={c.id}>
          <h3>{c.title}</h3>
          <p className="muted">{c.note}</p>
          {c.examDate && <p className="tag">Examen: {formatHuman(c.examDate)}</p>}
        </div>
      ))}
    </div>
  )
}

export default function Calendar({ dateISO, state, toggleRequirement, markBookCompleted, unmarkBookCompleted }) {
  const [month, setMonth] = useState(monthKey(dateISO))
  const [selected, setSelected] = useState(null)
  const weeks = buildMonthGrid(month)
  const minMonth = monthKey(periodStart)
  const maxMonth = monthKey(periodEnd)
  const schedule = buildDynamicSchedule(state.completedBooks, dateISO)

  return (
    <div className="view">
      <header className="view-header">
        <h1>Calendario</h1>
        <p className="muted">Hacé clic en un día para ver el detalle y marcar avances. Si terminás un libro antes o después, el resto del calendario se recorre solo.</p>
      </header>

      <div className="cal-nav">
        <button disabled={month <= minMonth} onClick={() => setMonth(addMonths(month, -1))}>← Mes anterior</button>
        <h2>{monthLabel(month)}</h2>
        <button disabled={month >= maxMonth} onClick={() => setMonth(addMonths(month, 1))}>Mes siguiente →</button>
      </div>

      <div className="table-wrap">
        <table className="cal-grid">
          <thead>
            <tr>
              {WEEKDAYS.map((w) => (
                <th key={w}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i}>
                {week.map((iso, j) => (
                  <DayCell
                    key={iso || `empty-${i}-${j}`}
                    iso={iso}
                    entries={iso ? activeScheduleEntries(iso, schedule) : []}
                    dayProjects={iso ? activeProjectsOn(iso, schedule) : []}
                    exam={iso ? certs.find((c) => c.examDate === iso) : null}
                    isSelected={iso === selected}
                    onSelect={setSelected}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cal-legend">
        {schedule.map(({ book }) => (
          <span key={book.id} className={`cal-tag cal-book-${book.order}`}>{SHORT_BOOK[book.id] || book.title}</span>
        ))}
        <span className="cal-tag cal-project">Proyecto</span>
        <span className="cal-tag cal-exam">🎯 Examen</span>
      </div>

      {selected && (
        <DayDetail
          iso={selected}
          entries={activeScheduleEntries(selected, schedule)}
          dayProjects={activeProjectsOn(selected, schedule)}
          cts={activeCerts(selected)}
          state={state}
          toggleRequirement={toggleRequirement}
          markBookCompleted={markBookCompleted}
          unmarkBookCompleted={unmarkBookCompleted}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
