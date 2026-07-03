import { config } from './config'
import express from 'express'
import cors from 'cors'
import portfolioRouter from './routes/portfolio'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use('/api/portfolio', portfolioRouter)

app.listen(config.port, () => {
  console.log(`finance-dash backend listening on http://localhost:${config.port}`)
})
