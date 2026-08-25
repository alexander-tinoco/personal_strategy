import express from 'express'
import cors from 'cors'
import pg from 'pg'

const { Pool } = pg

const PORT = process.env.PORT || 4000
const DEFAULT_STATE = { loggedHours: {}, checkedRequirements: {}, completedBooks: {}, completedProjects: {} }

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      id INT PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(
    `INSERT INTO progress (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING`,
    [DEFAULT_STATE],
  )
}

// Postgres puede tardar unos segundos en aceptar conexiones al arrancar el
// contenedor por primera vez; reintenta en vez de morir en el primer intento.
async function waitForDb(retries = 20, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1')
      return
    } catch (err) {
      console.log(`Esperando a Postgres... (${i + 1}/${retries})`)
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  throw new Error('No se pudo conectar a Postgres.')
}

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/state', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM progress WHERE id = 1')
    res.json(rows[0]?.data ?? DEFAULT_STATE)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo leer el progreso.' })
  }
})

app.put('/api/state', async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO progress (id, data, updated_at) VALUES (1, $1, now())
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now()`,
      [req.body],
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo guardar el progreso.' })
  }
})

await waitForDb()
await ensureSchema()

app.listen(PORT, () => {
  console.log(`Roadmap 2026 API escuchando en el puerto ${PORT}`)
})
