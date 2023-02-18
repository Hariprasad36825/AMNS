import { validationResult } from 'express-validator'
import {
  errorMessageWrapper,
  PostMessage,
  successMessageWrapper
} from '../errorResponses'
import { addPost, getPost } from '../services/post.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'

export const create = async (req, res) => {
  validationResult(req).throw()
  const user = req.user?._id
  const { caption, tags, attachments } = req.body

  if (await addPost({ user, caption, tags, attachments })) {
    return res
      .status(CREATION_SUCCESSFULL)
      .send(successMessageWrapper(PostMessage.created))
  }
  res.status(BAD_REQUEST).send(errorMessageWrapper(PostMessage.error))
}

export const index = async (req, res) => {
  const posts = await getPost()
  res.status(OK).send(posts)
}
