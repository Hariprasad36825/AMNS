import express, { json } from 'express'
import { OK } from './statusCodes'

const app = express()

// Cors Configuration - to allow swagger ui to read response
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested, Content-Type, Accept Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE')
    return res.status(OK).json({})
  }
  next()
})

// init middleware for express validator to be able to intercept request
app.use(json())

// routes
app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app
