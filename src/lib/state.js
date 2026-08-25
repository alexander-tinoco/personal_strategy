import { useState, useEffect } from 'react'
import { todayISO } from './dates.js'

const KEY = 'roadmap-2026-state-v1'

const EMPTY = { loggedHours: {}, checkedRequirements: {}, completedBooks: {}, completedProjects: {} }

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return {
      loggedHours: parsed.loggedHours || {},
      checkedRequirements: parsed.checkedRequirements || {},
      completedBooks: parsed.completedBooks || {},
      completedProjects: parsed.completedProjects || {},
    }
  } catch {
    return { ...EMPTY }
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // localStorage no disponible: el progreso no persiste en esta sesión.
  }
}

export function useLocalState() {
  const [state, setState] = useState(load)

  useEffect(() => {
    save(state)
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

  function setHours(bookId, totalHours) {
    setState((prev) => ({
      ...prev,
      loggedHours: { ...prev.loggedHours, [bookId]: Math.max(0, totalHours) },
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

  return {
    state,
    logHours,
    setHours,
    toggleRequirement,
    markBookCompleted,
    unmarkBookCompleted,
    markProjectCompleted,
    unmarkProjectCompleted,
  }
}
