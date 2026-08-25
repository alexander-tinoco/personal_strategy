import { useState } from 'react'
import { monthKey, addMonths, monthLabel, buildMonthGrid, todayISO, isBetween } from '../lib/dates.js'
import { books, projects, certs, periodStart, periodEnd } from '../data/roadmap.js'

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

function activeOn(iso, list) {
  return list.filter((item) => isBetween(iso, item.start, item.end))
}

function DayCell({ iso }) {
  if (!iso) return <td className="cal-cell empty" />
  const today = iso === todayISO()
  const inWindow = isBetween(iso, periodStart, periodEnd)
  const dayBooks = activeOn(iso, books)
  const dayProjects = activeOn(iso, projects)
  const exam = certs.find((c) => c.examDate === iso)
  const dayNum = Number(iso.slice(8, 10))

  return (
    <td className={`cal-cell${today ? ' is-today' : ''}${inWindow ? '' : ' outside'}`}>
      <div className="cal-daynum">{dayNum}</div>
      <div className="cal-tags">
        {dayBooks.map((b) => (
          <span key={b.id} className={`cal-tag cal-book-${b.order}`}>
            {SHORT_BOOK[b.id] || b.title}
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

export default function Calendar({ dateISO }) {
  const [month, setMonth] = useState(monthKey(dateISO))
  const weeks = buildMonthGrid(month)
  const minMonth = monthKey(periodStart)
  const maxMonth = monthKey(periodEnd)

  return (
    <div className="view">
      <header className="view-header">
        <h1>Calendario</h1>
        <p className="muted">Cada celda muestra el libro y el proyecto activos ese día.</p>
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
                  <DayCell key={iso || `empty-${i}-${j}`} iso={iso} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cal-legend">
        {books.map((b) => (
          <span key={b.id} className={`cal-tag cal-book-${b.order}`}>{SHORT_BOOK[b.id] || b.title}</span>
        ))}
        <span className="cal-tag cal-project">Proyecto</span>
        <span className="cal-tag cal-exam">🎯 Examen</span>
      </div>
    </div>
  )
}
