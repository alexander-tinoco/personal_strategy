import { projects, books, certs } from '../data/roadmap.js'
import { formatHuman } from '../lib/dates.js'
import { buildDynamicSchedule, projectWindow } from '../lib/schedule.js'

export default function Projects({ state, dateISO, toggleRequirement }) {
  const schedule = buildDynamicSchedule(state.completedBooks, dateISO)

  return (
    <div className="view">
      <header className="view-header">
        <h1>Proyectos aplicados</h1>
        <p className="muted">Un proyecto tangible por libro/certificación — el objetivo es llegar a diciembre con ~10-12 proyectos reales en GitHub. Las fechas se recalculan según cuándo termines cada libro.</p>
      </header>
      {projects.map((p) => {
        const linked = p.bookId ? books.find((b) => b.id === p.bookId) : certs.find((c) => c.id === p.certId)
        const doneCount = p.requirements.filter((_, i) => state.checkedRequirements[`${p.id}:${i}`]).length
        const allDone = doneCount === p.requirements.length
        const w = projectWindow(p, schedule)
        return (
          <div className="card" key={p.id}>
            <div className="card-title-row">
              <h3>{p.title}</h3>
              <span className="tag">{formatHuman(w.start)} → {formatHuman(w.end)}</span>
            </div>
            <p className="muted">Vinculado a: {linked ? linked.title : '—'}</p>
            {(w.start !== p.start || w.end !== p.end) && (
              <p className="note">Plan original: {formatHuman(p.start)} → {formatHuman(p.end)}</p>
            )}
            <p>{p.objetivo}</p>
            <p className="stat-label">{allDone ? '✓ Completo' : `${doneCount}/${p.requirements.length} requisitos cumplidos`}</p>
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
        )
      })}
    </div>
  )
}
