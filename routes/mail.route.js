import { Router } from 'express'
import { sendMail } from '../controllers/mail.controller'
import { isAuthorised } from '../middleware/auth.middleware'

export const mailRouter = Router()

mailRouter.post('/', isAuthorised(), (req, res, next) => {
  sendMail(req, res, next)
})
