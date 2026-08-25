import { useState } from 'react'

export default function HoursLogger({ book, remaining, onLog }) {
  const [value, setValue] = useState('')
  return (
    <form
      className="log-form"
      onSubmit={(e) => {
        e.preventDefault()
        const n = parseFloat(value.replace(',', '.'))
        if (!Number.isNaN(n) && n > 0) {
          onLog(book.id, n)
          setValue('')
        }
      }}
    >
      <input
        type="number"
        step="0.1"
        min="0"
        placeholder="hs leídas"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" disabled={remaining <= 0}>
        Registrar
      </button>
    </form>
  )
}
