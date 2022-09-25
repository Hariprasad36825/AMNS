import { Router } from 'express'
import { body } from 'express-validator'
import { getUserDetails, loginUser } from '../controllers/user.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const loginRouter = Router()

loginRouter.post(
  '/',
  body('email', 'please do not use Kct Email').matches(
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
  ),
  body('password', 'please enter valid password').matches(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/gim
  ),
  (req, res, next) => {
    wrapAsync(loginUser, req, res, next)
  }
)

loginRouter.get('/', isAuthorised(), (req, res, next) => {
  wrapAsync(getUserDetails, req, res, next)
})

export default loginRouter
