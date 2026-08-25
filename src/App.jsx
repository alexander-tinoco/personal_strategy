import { useState, useRef } from 'react'
import { todayISO, daysInclusive } from './lib/dates.js'
import { useLocalState } from './lib/state.js'
import { periodEnd, periodStart } from './data/roadmap.js'
import Today from './components/Today.jsx'
import Calendar from './components/Calendar.jsx'
import { buildBookSchedule, buildCourseSchedule, buildProjectSchedule } from './lib/schedule.js'

const TABS = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'calendario', label: 'Calendario' },
]

function SyncIndicator({ status }) {
  const label = {
    loading: '⏳ Conectando al servidor…',
    ok: '🟢 Guardado en el servidor',
    error: '🔴 Sin conexión al backend (¿corriste "docker compose up"?)',
  }[status]
  return <p className="muted small sync-indicator">{label}</p>
}

function BackupControls({ state, importState }) {
  const fileInput = useRef(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roadmap-2026-backup-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        importState(parsed)
      } catch {
        alert('El archivo no es un backup válido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="backup-controls">
      <button className="ghost-btn small" onClick={handleExport}>⬇ Exportar backup</button>
      <button className="ghost-btn small" onClick={() => fileInput.current?.click()}>⬆ Importar backup</button>
      <input ref={fileInput} type="file" accept="application/json" hidden onChange={handleImportFile} />
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('hoy')
  const {
    state,
    syncStatus,
    logHours,
    toggleRequirement,
    markBookCompleted,
    unmarkBookCompleted,
    markProjectCompleted,
    unmarkProjectCompleted,
    markCourseCompleted,
    unmarkCourseCompleted,
    importState,
  } = useLocalState()
  const dateISO = todayISO()
  const totalDays = daysInclusive(periodStart, periodEnd)
  const elapsed = daysInclusive(periodStart, dateISO)
  const bookSchedule = buildBookSchedule(state.completedBooks, dateISO)
  const courseSchedule = buildCourseSchedule(state.completedCourses, dateISO)
  const projectSchedule = buildProjectSchedule(state.completedProjects, dateISO)

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
          <SyncIndicator status={syncStatus} />
          <BackupControls state={state} importState={importState} />
        </div>
      </aside>
      <main className="content">
        {tab === 'hoy' && (
          <Today
            dateISO={dateISO}
            state={state}
            bookSchedule={bookSchedule}
            courseSchedule={courseSchedule}
            projectSchedule={projectSchedule}
            logHours={logHours}
            toggleRequirement={toggleRequirement}
            markBookCompleted={markBookCompleted}
            markCourseCompleted={markCourseCompleted}
            markProjectCompleted={markProjectCompleted}
          />
        )}
        {tab === 'calendario' && (
          <Calendar
            dateISO={dateISO}
            state={state}
            bookSchedule={bookSchedule}
            courseSchedule={courseSchedule}
            projectSchedule={projectSchedule}
            logHours={logHours}
            toggleRequirement={toggleRequirement}
            markBookCompleted={markBookCompleted}
            unmarkBookCompleted={unmarkBookCompleted}
            markCourseCompleted={markCourseCompleted}
            unmarkCourseCompleted={unmarkCourseCompleted}
            markProjectCompleted={markProjectCompleted}
            unmarkProjectCompleted={unmarkProjectCompleted}
          />
        )}
      </main>
    </div>
  )
}
