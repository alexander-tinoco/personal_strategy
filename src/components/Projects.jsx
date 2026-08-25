import { books, certs } from '../data/roadmap.js'
import { formatHuman } from '../lib/dates.js'

export default function Projects({ state, projectSchedule, toggleRequirement, markProjectCompleted, unmarkProjectCompleted }) {
  return (
    <div className="view">
      <header className="view-header">
        <h1>Proyectos aplicados</h1>
        <p className="muted">
          Un proyecto tangible por libro/certificación — el objetivo es llegar a diciembre con ~10-12 proyectos reales
          en GitHub. Los 9 proyectos de libro se encadenan entre sí (si uno tarda más o menos, corre a los siguientes);
          los 3 de certificación tienen ventana propia en paralelo.
        </p>
      </header>
      {projectSchedule.map(({ project: p, dynStart, dynEnd, isCompleted, isOverdue, shiftedFromPlan }) => {
        const linked = p.bookId ? books.find((b) => b.id === p.bookId) : certs.find((c) => c.id === p.certId)
        const doneCount = p.requirements.filter((_, i) => state.checkedRequirements[`${p.id}:${i}`]).length
        const allDone = doneCount === p.requirements.length
        return (
          <div className="card" key={p.id}>
            <div className="card-title-row">
              <h3>{p.title}</h3>
              <span className="tag">{formatHuman(dynStart)} → {formatHuman(dynEnd)}</span>
            </div>
            <p className="muted">Vinculado a: {linked ? linked.title : '—'}</p>
            {(dynStart !== p.start || dynEnd !== p.end) && (
              <p className="note">Plan original: {formatHuman(p.start)} → {formatHuman(p.end)}</p>
            )}
            {isCompleted && <p className="note ok">✓ Terminado.</p>}
            {!isCompleted && isOverdue && <p className="note warn">⚠ Atrasado respecto al plan original — esto corrió los siguientes proyectos.</p>}
            {!isCompleted && !isOverdue && shiftedFromPlan && <p className="note ok">🟢 Adelantado respecto al plan original.</p>}
            <p>{p.objetivo}</p>
            <p className="stat-label">{allDone ? '✓ Checklist completo' : `${doneCount}/${p.requirements.length} requisitos cumplidos`}</p>
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
              {!isCompleted ? (
                <button className="ghost-btn" onClick={() => markProjectCompleted(p.id)}>✓ Marcar como completo</button>
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
