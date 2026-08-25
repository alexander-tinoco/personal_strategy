import { books, projects, certs, dailyBudgets, periodStart } from '../data/roadmap.js'
import { daysInclusive, addDays, todayISO } from './dates.js'

// Meta de hoy para un item con ritmo fijo: no tiene sentido pedir más de lo
// que falta el último día.
export function todaysTarget(remainingHours, pace) {
  if (remainingHours == null) return null
  return Math.max(0, Math.min(pace, remainingHours))
}

export function remainingHoursFor(item, loggedHours) {
  if (item.hours == null) return null
  const logged = loggedHours[item.id] || 0
  return Math.max(0, item.hours - logged)
}

// --- Motor de re-programación dinámica ---
// Encadena una lista de items (ordenados por `order`) uno detrás del otro,
// arrancando en `anchorStart`: si marcás uno como terminado antes de lo
// planeado, el siguiente arranca antes (todo lo que sigue se adelanta); si
// te atrasás, empuja a los siguientes. `completedMap` es
// { id: fechaISOenQueLoTerminaste }. `getPlannedDays(item)` decide cuántos
// días "dura" cada item en el plan.
function chainSequential(items, completedMap, dateISO, getPlannedDays, anchorStart) {
  const sorted = [...items].sort((a, b) => a.order - b.order)
  let cursor = anchorStart
  const out = []

  for (const item of sorted) {
    const plannedDays = getPlannedDays(item)
    const dynStart = cursor
    const tentativeEnd = addDays(dynStart, plannedDays - 1)
    const completedOn = completedMap[item.id] || null
    let dynEnd
    let isOverdue = false
    let isAhead = false

    if (completedOn) {
      dynEnd = completedOn < dynStart ? dynStart : completedOn
      isAhead = dynEnd < tentativeEnd
    } else if (dateISO > tentativeEnd) {
      dynEnd = dateISO
      isOverdue = true
    } else {
      dynEnd = tentativeEnd
    }

    out.push({
      item,
      dynStart,
      dynEnd,
      plannedDays,
      isCompleted: !!completedOn,
      completedOn,
      isOverdue,
      isAhead,
      inProgress: !completedOn && dateISO >= dynStart && dateISO <= dynEnd,
      isPending: dateISO < dynStart,
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
  let isAhead = false

  if (completedOn) {
    dynEnd = completedOn < dynStart ? dynStart : completedOn
    isAhead = dynEnd < item.end
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
    isAhead,
    inProgress: !completedOn && dateISO >= dynStart && dateISO <= dynEnd,
    isPending: dateISO < dynStart,
  }
}

// Los 9 libros se leen uno detrás de otro a un ritmo fijo (dailyBudgets.reading
// horas/día): cada uno "dura" ceil(horas / ritmo) días.
export function buildBookSchedule(completedBooks = {}, dateISO = todayISO(), pace = dailyBudgets.reading) {
  return chainSequential(
    books,
    completedBooks,
    dateISO,
    (b) => Math.max(1, Math.ceil(b.hours / pace)),
    periodStart,
  ).map((e) => ({ ...e, book: e.item }))
}

// Los cursos con horas asignadas (GCP -> Databricks -> Docker+K8s) se
// encadenan igual, a dailyBudgets.course horas/día, en paralelo a la
// lectura (arrancan también en periodStart). Terraform (sin `order`) queda
// afuera: es opcional y no está paceado.
export function buildCourseSchedule(completedCourses = {}, dateISO = todayISO(), pace = dailyBudgets.course) {
  const chainable = certs.filter((c) => c.order != null && c.hours != null)
  return chainSequential(
    chainable,
    completedCourses,
    dateISO,
    (c) => Math.max(1, Math.ceil(c.hours / pace)),
    periodStart,
  ).map((e) => ({ ...e, cert: e.item }))
}

// Los 9 proyectos de libro se encadenan entre sí por su duración planeada
// original (no tienen un total de horas, se cierran a checklist), también
// en paralelo desde periodStart. Los 3 proyectos de certificación corren en
// paralelo, cada uno con ventana fija.
export function buildProjectSchedule(completedProjects = {}, dateISO = todayISO()) {
  const sequential = projects.filter((p) => p.bookId)
  const standalone = projects.filter((p) => p.certId)
  const chained = chainSequential(
    sequential,
    completedProjects,
    dateISO,
    (p) => daysInclusive(p.start, p.end),
    periodStart,
  )
  const alone = standalone.map((p) => standaloneEntry(p, completedProjects, dateISO))
  return [...chained, ...alone]
    .sort((a, b) => a.item.order - b.item.order)
    .map((e) => ({ ...e, project: e.item }))
}

export function activeEntriesOn(dateISO, schedule) {
  return schedule.filter((e) => dateISO >= e.dynStart && dateISO <= e.dynEnd)
}
