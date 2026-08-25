import roadmapRaw from '../../docs/roadmap-final-ago-dic-2026.md?raw'

export default function RoadmapDoc() {
  return (
    <div className="view">
      <header className="view-header">
        <h1>Roadmap original</h1>
        <p className="muted">docs/roadmap-final-ago-dic-2026.md</p>
      </header>
      <div className="card">
        <pre className="raw-doc">{roadmapRaw}</pre>
      </div>
    </div>
  )
}
