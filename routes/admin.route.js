import { Router } from 'express'
import { body } from 'express-validator'
import { AddStaffs } from '../controllers/admin.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const adminRouter = Router()

adminRouter.post(
  '/',
  isAuthorised('admin'),
  body('staffs', 'staffs is required').isArray(),
  (req, res, next) => {
    wrapAsync(AddStaffs, req, res, next)
  }
)

export default adminRouter
