import { Router } from 'express'
import { body } from 'express-validator'
import { create, getTags, index } from '../controllers/post.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

export const postRouter = Router()

postRouter.post(
  '/',
  isAuthorised(),
  body('caption', 'caption is required').notEmpty(),
  body('tags', 'tags should be there').isArray(),
  body('attachments', 'invalid attachment').isArray(),
  (req, res, next) => {
    wrapAsync(create, req, res, next)
  }
)

postRouter.get('', isAuthorised(), (req, res, next) => {
  wrapAsync(index, req, res, next)
})

postRouter.post('/tags', isAuthorised(), (req, res, next) => {
  wrapAsync(getTags, req, res, next)
})
