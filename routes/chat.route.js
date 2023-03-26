import { Router } from 'express'
import { findOrcreate, index, show } from '../controllers/chat.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const chatRouter = Router()

chatRouter.post('/create', isAuthorised(), (req, res, next) => {
  wrapAsync(findOrcreate, req, res, next)
})

chatRouter.get('/show/:roomId', isAuthorised(), (req, res, next) => {
  wrapAsync(show, req, res, next)
})

chatRouter.get('/index/:userId', isAuthorised(), (req, res, next) => {
  wrapAsync(index, req, res, next)
})

export default chatRouter
