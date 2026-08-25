export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISO(new Date())
}

export function addDays(iso, n) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

// Días inclusive entre dos fechas ISO (a..b), mínimo 1.
export function daysInclusive(aISO, bISO) {
  const a = parseISO(aISO)
  const b = parseISO(bISO)
  const diff = Math.round((b - a) / 86400000) + 1
  return Math.max(diff, 1)
}

export function isBetween(dateISO, startISO, endISO) {
  return dateISO >= startISO && dateISO <= endISO
}

export function isSaturday(iso) {
  return parseISO(iso).getDay() === 6
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function formatHuman(iso) {
  const d = parseISO(iso)
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`
}

export function formatShort(iso) {
  const d = parseISO(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthKey(iso) {
  return iso.slice(0, 7)
}

export function addMonths(yearMonth, n) {
  const [y, m] = yearMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number)
  return `${MESES[m - 1]} ${y}`
}

// Devuelve semanas (arrays de 7) para el mes 'YYYY-MM', empezando en lunes.
// Los días fuera del mes aparecen como null.
export function buildMonthGrid(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number)
  const firstWeekday = (new Date(y, m - 1, 1).getDay() + 6) % 7 // lunes=0 .. domingo=6
  const totalDays = new Date(y, m, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(toISO(new Date(y, m - 1, d)))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function formatHours(h) {
  if (h == null) return '—'
  const hours = Math.floor(h)
  const mins = Math.round((h - hours) * 60)
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} h`
  return `${hours} h ${mins} min`
}
