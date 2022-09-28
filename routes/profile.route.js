import {
  getProfile,
  getProfilePublicView
} from '../controllers/user.controller'
import { Router } from 'express'
import wrapAsync from '../utils/wrapAsync'
import { isAuthorised } from '../middleware/auth.middleware'

const profileRouter = Router()

profileRouter.get('/:type/:id', isAuthorised(), (req, res, next) => {
  wrapAsync(getProfilePublicView, req, res, next)
})

profileRouter.get('/', isAuthorised(), (req, res, next) => {
  wrapAsync(getProfile, req, res, next)
})

export default profileRouter
