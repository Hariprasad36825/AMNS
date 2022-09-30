import { Router } from 'express'
import { getStudentListUnderStaff } from '../controllers/staff.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const staffRouter = Router()

staffRouter.get('/', isAuthorised('staff'), (req, res, next) => {
  // console.log('in')
  wrapAsync(getStudentListUnderStaff, req, res, next)
})

export default staffRouter
