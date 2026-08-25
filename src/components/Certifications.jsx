import { certs, projects } from '../data/roadmap.js'
import { formatHuman } from '../lib/dates.js'

export default function Certifications() {
  return (
    <div className="view">
      <header className="view-header">
        <h1>Certificaciones / Cursos</h1>
        <p className="muted">En paralelo a la lectura. Los exámenes son los checkpoints duros del roadmap.</p>
      </header>
      {certs.map((c) => {
        const proj = projects.find((p) => p.certId === c.id)
        return (
          <div className="card" key={c.id}>
            <div className="card-title-row">
              <h3>{c.title}</h3>
              {c.optional && <span className="tag">Opcional</span>}
            </div>
            <p className="muted">{formatHuman(c.start)} → {formatHuman(c.end)}</p>
            {c.examDate && <p><strong>Examen:</strong> {formatHuman(c.examDate)}</p>}
            <p className="note">{c.note}</p>
            {proj && <p className="stat-label">Proyecto: {proj.title}</p>}
          </div>
        )
      })}
    </div>
  )
}
