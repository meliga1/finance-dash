import path from 'node:path'
import { config } from './config'
import express from 'express'
import cors from 'cors'
import { initDb } from './db'
import { requireAuth } from './auth'
import authRouter from './routes/auth'
import settingsRouter from './routes/settings'
import portfolioRouter from './routes/portfolio'

initDb()

const app = express()

// Necessário atrás do proxy da Fly para que `secure` cookies e `req.ip` funcionem.
app.set('trust proxy', 1)

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/settings', requireAuth, settingsRouter)
app.use('/api/portfolio', requireAuth, portfolioRouter)

if (config.isProduction) {
  const publicDir = path.join(__dirname, 'public')
  app.use(express.static(publicDir))

  // Fallback do SPA (React Router) — qualquer rota que não seja /api serve o index.html.
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}

app.listen(config.port, () => {
  console.log(`finance-dash backend listening on http://localhost:${config.port}`)
})
