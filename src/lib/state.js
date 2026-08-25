import { useState, useEffect, useRef } from 'react'
import { todayISO } from './dates.js'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const EMPTY = {
  loggedHours: {},
  checkedRequirements: {},
  completedBooks: {},
  completedProjects: {},
  completedCourses: {},
}

async function fetchState() {
  const res = await fetch(`${API_BASE}/api/state`)
  if (!res.ok) throw new Error('No se pudo leer el progreso del servidor.')
  return res.json()
}

async function saveState(state) {
  const res = await fetch(`${API_BASE}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  if (!res.ok) throw new Error('No se pudo guardar el progreso en el servidor.')
}

export function useLocalState() {
  const [state, setState] = useState(EMPTY)
  const [syncStatus, setSyncStatus] = useState('loading') // 'loading' | 'ok' | 'error'
  const loaded = useRef(false)

  useEffect(() => {
    fetchState()
      .then((data) => {
        setState({ ...EMPTY, ...data })
        setSyncStatus('ok')
      })
      .catch((err) => {
        console.error(err)
        setSyncStatus('error')
      })
      .finally(() => {
        loaded.current = true
      })
  }, [])

  useEffect(() => {
    if (!loaded.current) return
    saveState(state)
      .then(() => setSyncStatus('ok'))
      .catch((err) => {
        console.error(err)
        setSyncStatus('error')
      })
  }, [state])

  function logHours(bookId, deltaHours) {
    setState((prev) => ({
      ...prev,
      loggedHours: {
        ...prev.loggedHours,
        [bookId]: Math.max(0, (prev.loggedHours[bookId] || 0) + deltaHours),
      },
    }))
  }

  function toggleRequirement(key) {
    setState((prev) => ({
      ...prev,
      checkedRequirements: {
        ...prev.checkedRequirements,
        [key]: !prev.checkedRequirements[key],
      },
    }))
  }

  // Marca un libro/proyecto como terminado en la fecha dada: libera (o
  // extiende) su ventana planeada y corre en consecuencia lo que sigue.
  function markBookCompleted(bookId, dateISO = todayISO()) {
    setState((prev) => ({
      ...prev,
      completedBooks: { ...prev.completedBooks, [bookId]: dateISO },
    }))
  }

  function unmarkBookCompleted(bookId) {
    setState((prev) => {
      const next = { ...prev.completedBooks }
      delete next[bookId]
      return { ...prev, completedBooks: next }
    })
  }

  function markProjectCompleted(projectId, dateISO = todayISO()) {
    setState((prev) => ({
      ...prev,
      completedProjects: { ...prev.completedProjects, [projectId]: dateISO },
    }))
  }

  function unmarkProjectCompleted(projectId) {
    setState((prev) => {
      const next = { ...prev.completedProjects }
      delete next[projectId]
      return { ...prev, completedProjects: next }
    })
  }

  function markCourseCompleted(courseId, dateISO = todayISO()) {
    setState((prev) => ({
      ...prev,
      completedCourses: { ...prev.completedCourses, [courseId]: dateISO },
    }))
  }

  function unmarkCourseCompleted(courseId) {
    setState((prev) => {
      const next = { ...prev.completedCourses }
      delete next[courseId]
      return { ...prev, completedCourses: next }
    })
  }

  function importState(next) {
    setState({
      loggedHours: next.loggedHours || {},
      checkedRequirements: next.checkedRequirements || {},
      completedBooks: next.completedBooks || {},
      completedProjects: next.completedProjects || {},
      completedCourses: next.completedCourses || {},
    })
  }

  return {
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
  }
}
