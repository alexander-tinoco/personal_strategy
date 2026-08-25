import { books, projects, certs } from '../data/roadmap.js'
import { daysInclusive, isBetween } from './dates.js'

export function activeBooks(dateISO) {
  return books.filter((b) => isBetween(dateISO, b.start, b.end))
}

export function activeProjects(dateISO) {
  return projects.filter((p) => isBetween(dateISO, p.start, p.end))
}

export function activeCerts(dateISO) {
  return certs.filter((c) => isBetween(dateISO, c.start, c.end))
}

// Ritmo planeado (horas/día) si se reparte el total de horas del libro
// en partes iguales a lo largo de toda su ventana.
export function plannedDailyPace(book) {
  if (book.hours == null) return null
  return book.hours / daysInclusive(book.start, book.end)
}

// Ritmo real necesario HOY: horas restantes / días restantes desde hoy hasta el final de la ventana.
export function livePace(book, dateISO, remainingHours) {
  if (remainingHours == null) return null
  const daysLeft = daysInclusive(dateISO, book.end)
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
