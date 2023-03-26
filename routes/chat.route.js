import { Router } from 'express'
import { findOrcreate } from '../controllers/chat.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const chatRouter = Router()

chatRouter.post('/create', isAuthorised(), (req, res, next) => {
  wrapAsync(findOrcreate, req, res, next)
})

export default chatRouter
