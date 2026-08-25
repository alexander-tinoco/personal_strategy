import { useState } from 'react'
import { todayISO, daysInclusive } from './lib/dates.js'
import { useLocalState } from './lib/state.js'
import { periodEnd, periodStart } from './data/roadmap.js'
import Today from './components/Today.jsx'
import Calendar from './components/Calendar.jsx'
import Books from './components/Books.jsx'
import Projects from './components/Projects.jsx'
import Certifications from './components/Certifications.jsx'
import RoadmapDoc from './components/RoadmapDoc.jsx'
import { buildDynamicSchedule } from './lib/schedule.js'

const TABS = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'calendario', label: 'Calendario' },
  { id: 'libros', label: 'Libros' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'certs', label: 'Certificaciones' },
  { id: 'roadmap', label: 'Roadmap original' },
]

export default function App() {
  const [tab, setTab] = useState('hoy')
  const { state, logHours, setHours, toggleRequirement, markBookCompleted, unmarkBookCompleted } = useLocalState()
  const dateISO = todayISO()
  const totalDays = daysInclusive(periodStart, periodEnd)
  const elapsed = daysInclusive(periodStart, dateISO)
  const schedule = buildDynamicSchedule(state.completedBooks, dateISO)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h2>Roadmap 2026</h2>
          <p className="muted">25 ago — 31 dic</p>
        </div>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((elapsed / totalDays) * 100))}%` }} />
          </div>
          <p className="muted small">Semana {Math.ceil(elapsed / 7)} de ~{Math.ceil(totalDays / 7)}</p>
        </div>
      </aside>
      <main className="content">
        {tab === 'hoy' && (
          <Today
            dateISO={dateISO}
            state={state}
            schedule={schedule}
            logHours={logHours}
            toggleRequirement={toggleRequirement}
            markBookCompleted={markBookCompleted}
          />
        )}
        {tab === 'calendario' && (
          <Calendar
            dateISO={dateISO}
            state={state}
            toggleRequirement={toggleRequirement}
            markBookCompleted={markBookCompleted}
            unmarkBookCompleted={unmarkBookCompleted}
          />
        )}
        {tab === 'libros' && (
          <Books
            state={state}
            dateISO={dateISO}
            setHours={setHours}
            markBookCompleted={markBookCompleted}
            unmarkBookCompleted={unmarkBookCompleted}
          />
        )}
        {tab === 'proyectos' && <Projects state={state} dateISO={dateISO} toggleRequirement={toggleRequirement} />}
        {tab === 'certs' && <Certifications />}
        {tab === 'roadmap' && <RoadmapDoc />}
      </main>
    </div>
  )
}
