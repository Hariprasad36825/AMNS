import { Router } from 'express'
import { body } from 'express-validator'
import {
  deleteFile,
  getFileUrl,
  registerUser,
  uploadFiles
} from '../controllers/user.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

export const userRouter = Router()

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
  (req, res, next) => {
    wrapAsync(registerUser, req, res, next)
  }
)

export const uploadRouter = Router()

uploadRouter.post('/attachment', isAuthorised(), (req, res) => {
  uploadFiles(req, res)
})

uploadRouter.delete('/:fileName', isAuthorised(), (req, res) => {
  deleteFile(req, res)
})

uploadRouter.get('/:fileName', isAuthorised(), (req, res) => {
  getFileUrl(req, res)
})
