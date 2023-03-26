import { Router } from 'express'
import { body } from 'express-validator'
import {
  addComment,
  create,
  getComments,
  getTags,
  index
} from '../controllers/post.controller'
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

postRouter.post('/:postId/comments', isAuthorised(), (req, res, next) => {
  wrapAsync(addComment, req, res, next)
})

postRouter.get('/:postId/comments', isAuthorised(), (req, res, next) => {
  wrapAsync(getComments, req, res, next)
})
