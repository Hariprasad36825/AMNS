import { getStudentListUnderStaff } from '../controllers/staff.controller'
import { Router } from 'express'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const staffRouter = Router()

staffRouter.get('/', isAuthorised('staff'), (req, res, next) => {
  wrapAsync(getStudentListUnderStaff, req, res, next)
})

export default staffRouter
