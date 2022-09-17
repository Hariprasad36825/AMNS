import { Router } from 'express'
import { body } from 'express-validator'
import { registerUser } from '../controllers/user.controller'
import wrapAsync from '../utils/wrapAsync'

const userRouter = Router()

userRouter.post(
  '/',
  body('name', 'name is required').notEmpty(),
  body('email', 'Enter valid email').isEmail(),
  body('password', 'password should be of 8 - 16 characters length').isLength({
    min: 8,
    max: 16
  }),
  body(
    'password',
    'Please enter a password with atleast one lower case character'
  ).matches(/^(?=.*[a-z])[0-9a-zA-Z!@#$&()\\-`.+,/]{1,}$/),
  body(
    'password',
    'Please enter a password with atleast one upper case character'
  ).matches(/^(?=.*[A-Z])[0-9a-zA-Z!@#$&()\\-`.+,/]{1,}$/),
  body('password', 'Please enter a password with atleast one number').matches(
    /^(?=.*\d)[0-9a-zA-Z!@#$&()\\-`.+,/]{1,}$/
  ),
  body('type').custom((value) => {
    if (!['student', 'staff', 'admin'].includes(value)) {
      return Promise.reject(
        new Error('Please enter type as student or staff or admin')
      )
    }
    return Promise.resolve()
  }),
  (req, res, next) => {
    // console.log(next)
    wrapAsync(registerUser, req, res, next)
  }
)

export default userRouter
