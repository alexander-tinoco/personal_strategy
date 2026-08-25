import { books, projects, certs } from '../data/roadmap.js'
import { daysInclusive, isBetween, addDays, todayISO } from './dates.js'

export function activeCerts(dateISO) {
  return certs.filter((c) => isBetween(dateISO, c.start, c.end))
}

// Ritmo planeado (horas/día) si se reparte el total de horas del libro
// en partes iguales a lo largo de su ventana ORIGINAL (la del roadmap).
export function plannedDailyPace(book) {
  if (book.hours == null) return null
  return book.hours / daysInclusive(book.start, book.end)
}

// Ritmo real necesario: horas restantes / días restantes hasta endISO.
export function liveDailyPace(remainingHours, dateISO, endISO) {
  if (remainingHours == null) return null
  const daysLeft = daysInclusive(dateISO, endISO)
  return remainingHours / daysLeft
}

export function remainingHoursFor(book, loggedHours) {
  if (book.hours == null) return null
  const logged = loggedHours[book.id] || 0
  return Math.max(0, book.hours - logged)
}

export function projectFor(bookId) {
  return projects.find((p) => p.bookId === bookId)
}

export function projectForCert(certId) {
  return projects.find((p) => p.certId === certId)
}

export function bookById(id) {
  return books.find((b) => b.id === id)
}

// --- Programación dinámica de los 9 libros (y su proyecto 1:1) ---
// Se leen en orden encadenado: si terminás uno antes de lo planeado, el
// siguiente arranca antes (se "adelanta" todo lo que viene después); si te
// atrasás, empuja a los siguientes. Las certificaciones (Databricks/GCP/
// Docker+K8s) corren en paralelo y mantienen su ventana fija del roadmap.
export function buildDynamicSchedule(completedBooks = {}, dateISO = todayISO()) {
  const sorted = [...books].sort((a, b) => a.order - b.order)
  let cursor = sorted[0].start
  const schedule = []

  for (const book of sorted) {
    const plannedDays = daysInclusive(book.start, book.end)
    const dynStart = cursor
    const completedOn = completedBooks[book.id] || null
    let dynEnd
    let isOverdue = false

    if (completedOn) {
      dynEnd = completedOn < dynStart ? dynStart : completedOn
    } else {
      const tentativeEnd = addDays(dynStart, plannedDays - 1)
      if (dateISO > tentativeEnd) {
        dynEnd = dateISO
        isOverdue = true
      } else {
        dynEnd = tentativeEnd
      }
    }

    schedule.push({
      book,
      dynStart,
      dynEnd,
      plannedDays,
      isCompleted: !!completedOn,
      completedOn,
      isOverdue,
      inProgress: !completedOn && dateISO >= dynStart && dateISO <= dynEnd,
      isPending: dateISO < dynStart,
      shiftedFromPlan: dynStart !== book.start,
    })

    cursor = addDays(dynEnd, 1)
  }

  return schedule
}

export function scheduleEntryFor(bookId, schedule) {
  return schedule.find((e) => e.book.id === bookId)
}

export function activeScheduleEntries(dateISO, schedule) {
  return schedule.filter((e) => dateISO >= e.dynStart && dateISO <= e.dynEnd)
}

// Ventana dinámica de un proyecto: si está atado a un libro, hereda su
// ventana dinámica; si está atado a una certificación, usa la ventana fija.
export function projectWindow(project, schedule) {
  if (project.bookId) {
    const entry = scheduleEntryFor(project.bookId, schedule)
    if (entry) return { start: entry.dynStart, end: entry.dynEnd }
  }
  return { start: project.start, end: project.end }
}

export function activeProjectsOn(dateISO, schedule) {
  return projects.filter((p) => {
    const w = projectWindow(p, schedule)
    return isBetween(dateISO, w.start, w.end)
  })
}
