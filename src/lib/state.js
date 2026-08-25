import { useState, useEffect } from 'react'

const KEY = 'roadmap-2026-state-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { loggedHours: {}, checkedRequirements: {} }
    const parsed = JSON.parse(raw)
    return {
      loggedHours: parsed.loggedHours || {},
      checkedRequirements: parsed.checkedRequirements || {},
    }
  } catch {
    return { loggedHours: {}, checkedRequirements: {} }
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

  return { state, logHours, setHours, toggleRequirement }
}
