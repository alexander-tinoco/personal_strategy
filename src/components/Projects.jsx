import { projects, books, certs } from '../data/roadmap.js'
import { formatHuman } from '../lib/dates.js'

export default function Projects({ state, toggleRequirement }) {
  return (
    <div className="view">
      <header className="view-header">
        <h1>Proyectos aplicados</h1>
        <p className="muted">Un proyecto tangible por libro/certificación — el objetivo es llegar a diciembre con ~10-12 proyectos reales en GitHub.</p>
      </header>
      {projects.map((p) => {
        const linked = p.bookId ? books.find((b) => b.id === p.bookId) : certs.find((c) => c.id === p.certId)
        const doneCount = p.requirements.filter((_, i) => state.checkedRequirements[`${p.id}:${i}`]).length
        return (
          <div className="card" key={p.id}>
            <div className="card-title-row">
              <h3>{p.title}</h3>
              <span className="tag">{formatHuman(p.start)} → {formatHuman(p.end)}</span>
            </div>
            <p className="muted">Vinculado a: {linked ? linked.title : '—'}</p>
            <p>{p.objetivo}</p>
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
          </div>
        )
      })}
    </div>
  )
}
