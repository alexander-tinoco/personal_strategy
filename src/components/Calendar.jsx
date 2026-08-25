import { useState } from 'react'
import { monthKey, addMonths, monthLabel, buildMonthGrid, todayISO, formatHuman, formatHours } from '../lib/dates.js'
import { periodStart, periodEnd } from '../data/roadmap.js'
import { activeEntriesOn, remainingHoursFor, todaysTarget, getDailyBudget } from '../lib/schedule.js'
import HoursLogger from './HoursLogger.jsx'

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

const SHORT_COURSE = {
  gcp: 'Curso: GCP',
  databricks: 'Curso: Databricks',
  'docker-k8s': 'Curso: Docker+K8s',
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

// Máximo 3 tags por día (libro + curso + proyecto): el "fin de curso" se
// muestra como marca dentro del tag del curso, no como un cuarto tag.
function DayCell({ iso, bookEntries, courseEntries, projectEntries, isSelected, onSelect }) {
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
        {bookEntries.map(({ book, isCompleted, isOverdue }) => (
          <span key={book.id} className={`cal-tag cal-book-${book.order}${isCompleted ? ' cal-done' : ''}${isOverdue ? ' cal-overdue' : ''}`}>
            {SHORT_BOOK[book.id] || book.title}
          </span>
        ))}
        {courseEntries.map(({ cert, dynEnd, isCompleted, isOverdue }) => (
          <span key={cert.id} className={`cal-tag cal-course${isCompleted ? ' cal-done' : ''}${isOverdue ? ' cal-overdue' : ''}`}>
            {dynEnd === iso ? '🎯 ' : ''}{SHORT_COURSE[cert.id] || cert.title}
          </span>
        ))}
        {projectEntries.map(({ project, isCompleted, isOverdue }) => (
          <span key={project.id} className={`cal-tag cal-project${isCompleted ? ' cal-done' : ''}${isOverdue ? ' cal-overdue' : ''}`}>
            {SHORT_PROJECT[project.id] || project.title}
          </span>
        ))}
      </div>
    </td>
  )
}

function DayDetail({
  iso,
  bookEntries,
  courseEntries,
  projectEntries,
  state,
  logHours,
  toggleRequirement,
  markBookCompleted,
  unmarkBookCompleted,
  markCourseCompleted,
  unmarkCourseCompleted,
  markProjectCompleted,
  unmarkProjectCompleted,
  onClose,
}) {
  const budget = getDailyBudget(iso)

  return (
    <div className="day-detail">
      <div className="day-detail-header">
        <h3>{formatHuman(iso)}</h3>
        <button className="ghost-btn" onClick={onClose}>Cerrar ✕</button>
      </div>
      <p className="muted">Ritmo de ese día: {budget.reading}h lectura + {budget.course}h curso + {budget.dev}h desarrollo.</p>

      {bookEntries.length === 0 && courseEntries.length === 0 && projectEntries.length === 0 && (
        <p className="muted">No hay nada planeado para este día.</p>
      )}

      {bookEntries.map(({ book, isCompleted, isOverdue }) => {
        const remaining = remainingHoursFor(book, state.loggedHours)
        const target = todaysTarget(remaining, budget.reading)
        return (
          <div className="card" key={book.id}>
            <div className="card-title-row">
              <h3>{book.title}</h3>
              <span className="tag">{book.author}</span>
            </div>
            <p className="muted">{book.why}</p>
            {isOverdue && <p className="note warn">⚠ Atrasado respecto al ritmo planeado.</p>}
            {isCompleted && <p className="note ok">✓ Marcado como terminado.</p>}
            <div className="stat-row">
              <div>
                <span className="stat-value">{formatHours(target)}</span>
                <span className="stat-label">meta ese día</span>
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
            <div className="row-actions">
              <HoursLogger book={book} remaining={remaining} onLog={logHours} />
              {!isCompleted ? (
                <button className="ghost-btn" onClick={() => markBookCompleted(book.id, iso)}>✓ Terminé este libro este día</button>
              ) : (
                <button className="ghost-btn" onClick={() => unmarkBookCompleted(book.id)}>Deshacer</button>
              )}
            </div>
          </div>
        )
      })}

      {courseEntries.map(({ cert, isCompleted, isOverdue }) => {
        const remaining = remainingHoursFor(cert, state.loggedHours)
        const target = todaysTarget(remaining, budget.course)
        return (
          <div className="card" key={cert.id}>
            <h3>{cert.title}</h3>
            <p className="muted">{cert.note}</p>
            {isOverdue && <p className="note warn">⚠ Atrasado respecto al ritmo planeado.</p>}
            {isCompleted && <p className="note ok">✓ Marcado como terminado.</p>}
            <div className="stat-row">
              <div>
                <span className="stat-value">{formatHours(target)}</span>
                <span className="stat-label">meta ese día</span>
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
              {!isCompleted ? (
                <button className="ghost-btn" onClick={() => markCourseCompleted(cert.id, iso)}>✓ Terminé este curso este día</button>
              ) : (
                <button className="ghost-btn" onClick={() => unmarkCourseCompleted(cert.id)}>Deshacer</button>
              )}
            </div>
          </div>
        )
      })}

      {projectEntries.map(({ project: p, isCompleted, isOverdue }) => {
        const doneCount = p.requirements.filter((_, i) => state.checkedRequirements[`${p.id}:${i}`]).length
        const invested = state.loggedHours[p.id] || 0
        return (
          <div className="card" key={p.id}>
            <h3>{p.title}</h3>
            <p className="muted">{p.objetivo}</p>
            {isOverdue && <p className="note warn">⚠ Atrasado respecto al plan original.</p>}
            {isCompleted && <p className="note ok">✓ Marcado como completo.</p>}
            <p className="stat-label">{doneCount}/{p.requirements.length} requisitos cumplidos · {formatHours(invested)} invertidas</p>
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
            <div className="row-actions">
              <HoursLogger book={p} remaining={null} onLog={logHours} />
              {!isCompleted ? (
                <button className="ghost-btn" onClick={() => markProjectCompleted(p.id, iso)}>✓ Terminé este proyecto este día</button>
              ) : (
                <button className="ghost-btn" onClick={() => unmarkProjectCompleted(p.id)}>Deshacer</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Calendar({
  dateISO,
  state,
  bookSchedule,
  courseSchedule,
  projectSchedule,
  logHours,
  toggleRequirement,
  markBookCompleted,
  unmarkBookCompleted,
  markCourseCompleted,
  unmarkCourseCompleted,
  markProjectCompleted,
  unmarkProjectCompleted,
}) {
  const [month, setMonth] = useState(monthKey(dateISO))
  const [selected, setSelected] = useState(null)
  const weeks = buildMonthGrid(month)
  const minMonth = monthKey(periodStart)
  const maxMonth = monthKey(periodEnd)

  return (
    <div className="view">
      <header className="view-header">
        <h1>Calendario</h1>
        <p className="muted">Hacé clic en un día para ver el detalle y marcar avances. Ritmo reducido los sábados. Si terminás un libro, curso o proyecto antes o después, el resto del calendario se recorre solo.</p>
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
                    bookEntries={iso ? activeEntriesOn(iso, bookSchedule) : []}
                    courseEntries={iso ? activeEntriesOn(iso, courseSchedule) : []}
                    projectEntries={iso ? activeEntriesOn(iso, projectSchedule) : []}
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
        {bookSchedule.map(({ book }) => (
          <span key={book.id} className={`cal-tag cal-book-${book.order}`}>{SHORT_BOOK[book.id] || book.title}</span>
        ))}
        <span className="cal-tag cal-course">Curso (🎯 = último día estimado)</span>
        <span className="cal-tag cal-project">Proyecto</span>
      </div>

      {selected && (
        <DayDetail
          iso={selected}
          bookEntries={activeEntriesOn(selected, bookSchedule)}
          courseEntries={activeEntriesOn(selected, courseSchedule)}
          projectEntries={activeEntriesOn(selected, projectSchedule)}
          state={state}
          logHours={logHours}
          toggleRequirement={toggleRequirement}
          markBookCompleted={markBookCompleted}
          unmarkBookCompleted={unmarkBookCompleted}
          markCourseCompleted={markCourseCompleted}
          unmarkCourseCompleted={unmarkCourseCompleted}
          markProjectCompleted={markProjectCompleted}
          unmarkProjectCompleted={unmarkProjectCompleted}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
