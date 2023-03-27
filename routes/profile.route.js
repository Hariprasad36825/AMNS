import { Router } from 'express'
import {
  getProfile,
  getProfilePublicView,
  getUserDetails
} from '../controllers/user.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const profileRouter = Router()

profileRouter.get('/:type/:id', isAuthorised(), (req, res, next) => {
  wrapAsync(getProfilePublicView, req, res, next)
})

profileRouter.get('/', isAuthorised(), (req, res, next) => {
  wrapAsync(getProfile, req, res, next)
})

profileRouter.get('/user', isAuthorised(), (req, res, next) => {
  wrapAsync(getUserDetails, req, res, next)
})

export default profileRouter
