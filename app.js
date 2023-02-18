import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { upload } from './config/storage.config'
import {
  handleDatabaseError,
  handleDefaultError,
  handleMongooseError,
  handleValidationError
} from './middleware/errorHandler.middleware'
import adminRouter from './routes/admin.route'
import {
  AdvisorRouter,
  CompanyRouter,
  DepartmentRouter,
  LocationRouter,
  SkillsRouter
} from './routes/getData.route'
import ImportRouter from './routes/import.route'
import loginRouter from './routes/login.route'
import { mailRouter } from './routes/mail.route'
import NotificationRouter from './routes/notification.route'
import { postRouter } from './routes/post.route'
import profileRouter from './routes/profile.route'
import staffRouter from './routes/staff.route'
import studentRouter from './routes/student.route'
import tokenRouter from './routes/token.route'
import { uploadRouter, userRouter } from './routes/user.route'
import { OK } from './statusCodes'
const app = express()

// init middleware for express validator to be able to intercept request
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })
)
app.use(upload.any())

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
if (process.env.NODE_ENV === 'test') {
  app.use(cors({ origin: true, credentials: true }))
}

// console.log(process.cwd())

// routes
app.get('', function (req, res) {
  return res.status(200).send('ok')
})
app.use('/api/register', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/getstudentofstaff', staffRouter)
app.use('/api/profile', profileRouter)
app.use('/api/refreshToken', tokenRouter)
app.use('/api/addStaff', adminRouter)

app.use('/api/location', LocationRouter)
app.use('/api/company', CompanyRouter)
app.use('/api/department', DepartmentRouter)
app.use('/api/skills', SkillsRouter)
app.use('/api/advisor', AdvisorRouter)
app.use('/api/student', studentRouter)
app.use('/api/staff', staffRouter)

app.use('/api/upload', uploadRouter)
app.use('/api/removefile', uploadRouter)
app.use('/api/attachment', uploadRouter)

app.use('/api/sendmail', mailRouter)

app.use('/api/notification', NotificationRouter)
app.use('/api/import', ImportRouter)

app.use('/api/posts', postRouter)

// error handlers
app.use(handleValidationError)
app.use(handleMongooseError)
app.use(handleDatabaseError)
app.use(handleDefaultError)

export default app
