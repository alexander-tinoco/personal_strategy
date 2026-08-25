import { books, projects, certs } from '../data/roadmap.js'
import { daysInclusive, isBetween, addDays, todayISO } from './dates.js'

export function activeCerts(dateISO) {
  return certs.filter((c) => isBetween(dateISO, c.start, c.end))
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

// --- Motor de re-programación dinámica ---
// Encadena una lista de items (ordenados por `order`) uno detrás del otro:
// si marcás uno como terminado antes de lo planeado, el siguiente arranca
// antes (todo lo que sigue se adelanta); si te atrasás, empuja a los
// siguientes. `completedMap` es { id: fechaISOenQueLoTerminaste }.
function chainSequential(items, completedMap, dateISO) {
  const sorted = [...items].sort((a, b) => a.order - b.order)
  let cursor = sorted[0]?.start
  const out = []

  for (const item of sorted) {
    const plannedDays = daysInclusive(item.start, item.end)
    const dynStart = cursor
    const completedOn = completedMap[item.id] || null
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

    out.push({
      item,
      dynStart,
      dynEnd,
      plannedDays,
      isCompleted: !!completedOn,
      completedOn,
      isOverdue,
      inProgress: !completedOn && dateISO >= dynStart && dateISO <= dynEnd,
      isPending: dateISO < dynStart,
      shiftedFromPlan: dynStart !== item.start,
    })

    cursor = addDays(dynEnd, 1)
  }

  return out
}

// Item con ventana propia fija (no se encadena con otros): solo se acorta
// si lo marcás terminado antes, o se extiende hasta hoy si te atrasás.
function standaloneEntry(item, completedMap, dateISO) {
  const dynStart = item.start
  const completedOn = completedMap[item.id] || null
  let dynEnd
  let isOverdue = false

  if (completedOn) {
    dynEnd = completedOn < dynStart ? dynStart : completedOn
  } else if (dateISO > item.end) {
    dynEnd = dateISO
    isOverdue = true
  } else {
    dynEnd = item.end
  }

  return {
    item,
    dynStart,
    dynEnd,
    plannedDays: daysInclusive(item.start, item.end),
    isCompleted: !!completedOn,
    completedOn,
    isOverdue,
    inProgress: !completedOn && dateISO >= dynStart && dateISO <= dynEnd,
    isPending: dateISO < dynStart,
    shiftedFromPlan: false,
  }
}

// Los 9 libros se leen uno detrás de otro: se encadenan.
export function buildBookSchedule(completedBooks = {}, dateISO = todayISO()) {
  return chainSequential(books, completedBooks, dateISO).map((e) => ({ ...e, book: e.item }))
}

// Los 9 proyectos de libro se encadenan entre sí (igual que los libros, pero
// de forma independiente: un proyecto puede tardar más o menos que su
// lectura). Los 3 proyectos de certificación corren en paralelo, cada uno
// con su propia ventana fija.
export function buildProjectSchedule(completedProjects = {}, dateISO = todayISO()) {
  const sequential = projects.filter((p) => p.bookId)
  const standalone = projects.filter((p) => p.certId)
  const chained = chainSequential(sequential, completedProjects, dateISO)
  const alone = standalone.map((p) => standaloneEntry(p, completedProjects, dateISO))
  return [...chained, ...alone]
    .sort((a, b) => a.item.order - b.item.order)
    .map((e) => ({ ...e, project: e.item }))
}

export function activeEntriesOn(dateISO, schedule) {
  return schedule.filter((e) => dateISO >= e.dynStart && dateISO <= e.dynEnd)
}
