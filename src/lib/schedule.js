import { books, projects, certs, dailyBudgetsByDay, periodStart } from '../data/roadmap.js'
import { daysInclusive, addDays, isSaturday, todayISO } from './dates.js'

// Ritmo del día (lectura/curso/desarrollo) según si es sábado o no.
export function getDailyBudget(dateISO) {
  return isSaturday(dateISO) ? dailyBudgetsByDay.saturday : dailyBudgetsByDay.weekday
}

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

// Simula día por día (respetando el ritmo reducido de sábado) hasta cubrir
// `totalHours`, empezando en `startISO`. Devuelve la fecha en que se cubren.
function estimateEndByHours(startISO, totalHours, paceForDate) {
  let remaining = totalHours
  let date = startISO
  for (let i = 0; i < 3650; i++) {
    remaining -= paceForDate(date)
    if (remaining <= 1e-9) return date
    date = addDays(date, 1)
  }
  return date
}

// --- Motor de re-programación dinámica (libros y cursos) ---
// Encadena items (ordenados por `order`) uno detrás del otro, arrancando en
// `anchorStart`, a un ritmo diario en horas que puede variar según el día
// (paceForDate). Si marcás uno como terminado antes de lo estimado, el
// siguiente arranca antes; si te atrasás, empuja a los siguientes.
function chainByHours(items, completedMap, dateISO, paceForDate, anchorStart) {
  const sorted = [...items].sort((a, b) => a.order - b.order)
  let cursor = anchorStart
  const out = []

  for (const item of sorted) {
    const dynStart = cursor
    const tentativeEnd = estimateEndByHours(dynStart, item.hours, paceForDate)
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
      plannedDays: daysInclusive(dynStart, tentativeEnd),
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

// --- Motor de re-programación dinámica (proyectos) ---
// Igual idea, pero la duración de cada item es un número fijo de días (no
// hay un total de horas: el proyecto se cierra a checklist / botón
// "terminado", no por presupuesto de horas).
function chainByDays(items, completedMap, dateISO, getPlannedDays, anchorStart) {
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

// Los 9 libros se leen uno detrás de otro al ritmo de lectura del día
// (2h entre semana, 1h sábado).
export function buildBookSchedule(completedBooks = {}, dateISO = todayISO()) {
  return chainByHours(books, completedBooks, dateISO, (d) => getDailyBudget(d).reading, periodStart)
    .map((e) => ({ ...e, book: e.item }))
}

// Los cursos con horas asignadas (GCP -> Databricks -> Docker+K8s) se
// encadenan igual, al ritmo de curso del día. Terraform (sin `order`) queda
// afuera: es opcional y no está paceado.
export function buildCourseSchedule(completedCourses = {}, dateISO = todayISO()) {
  const chainable = certs.filter((c) => c.order != null && c.hours != null)
  return chainByHours(chainable, completedCourses, dateISO, (d) => getDailyBudget(d).course, periodStart)
    .map((e) => ({ ...e, cert: e.item }))
}

// Los 9 proyectos de libro se encadenan entre sí por su duración planeada
// original (no tienen un total de horas, se cierran a checklist). Los 3
// proyectos de certificación corren en paralelo, cada uno con ventana fija.
export function buildProjectSchedule(completedProjects = {}, dateISO = todayISO()) {
  const sequential = projects.filter((p) => p.bookId)
  const standalone = projects.filter((p) => p.certId)
  const chained = chainByDays(
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
