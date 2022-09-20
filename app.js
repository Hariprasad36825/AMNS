import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import {
  handleDatabaseError,
  handleDefaultError,
  handleMongooseError,
  handleValidationError
} from './middleware/errorHandler.middleware'
import loginRouter from './routes/login.route'
import userRouter from './routes/user.route'
import { OK } from './statusCodes'
import staffRouter from './routes/staff.route'

const app = express()

// init middleware for express validator to be able to intercept request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Cors Configuration
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

// cors for development
if (process.env.NODE_ENV === 'development') app.use(cors())

// routes
app.get('', function (req, res) {
  return res.status(200).send('ok')
})
app.use('/api/register', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/getstudentofstaff', staffRouter)

// error handlers
app.use(handleValidationError)
app.use(handleMongooseError)
app.use(handleDatabaseError)
app.use(handleDefaultError)

export default app
