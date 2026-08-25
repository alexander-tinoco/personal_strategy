import { useState, useEffect } from 'react'
import { todayISO } from './dates.js'

const KEY = 'roadmap-2026-state-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { loggedHours: {}, checkedRequirements: {}, completedBooks: {} }
    const parsed = JSON.parse(raw)
    return {
      loggedHours: parsed.loggedHours || {},
      checkedRequirements: parsed.checkedRequirements || {},
      completedBooks: parsed.completedBooks || {},
    }
  } catch {
    return { loggedHours: {}, checkedRequirements: {}, completedBooks: {} }
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

  // Marca un libro como terminado hoy (o en la fecha dada): esto libera los
  // días sobrantes de su ventana planeada para que el siguiente libro/proyecto
  // arranque antes.
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

  return { state, logHours, setHours, toggleRequirement, markBookCompleted, unmarkBookCompleted }
}
