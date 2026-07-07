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

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/settings', requireAuth, settingsRouter)
app.use('/api/portfolio', requireAuth, portfolioRouter)

app.listen(config.port, () => {
  console.log(`finance-dash backend listening on http://localhost:${config.port}`)
})
