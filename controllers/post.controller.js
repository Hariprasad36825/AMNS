import { validationResult } from 'express-validator'
import fs from 'fs'
import path from 'path'
import { axiosInstance } from '../config/axios.config'
import {
  commentMessage,
  errorMessageWrapper,
  PostMessage,
  successMessageWrapper
} from '../errorResponses'
import { findComments, saveComment } from '../services/comment.services'
import { addPost, getPost } from '../services/post.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'
import { createFormData } from '../utils/createFormData'

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

export const getTags = async (req, res) => {
  const { fileName, content } = req.body

  let formData
  if (fileName) {
    const filePath = path.join(process.cwd(), 'uploads', fileName)

    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath)

      formData = createFormData(fileStream, { content })
    } else {
      formData = createFormData(null, { content })
    }
  } else {
    formData = createFormData(null, { content })
  }

  axiosInstance.defaults.headers.put['Content-Type'] = 'multipart/form-data'
  axiosInstance.defaults.headers.put.mimeType = 'multipart/form-data'

  await axiosInstance
    .post('/api/tags/predict', formData)
    .then((response) => {
      res.status(OK).send(response.data)
    })
    .catch(() => {
      res.status(BAD_REQUEST).send(errorMessageWrapper(PostMessage.error))
    })
}

export const addComment = async (req, res) => {
  const postId = req.params.postId
  const { name, body, userId } = req.body

  if (await saveComment({ name, body, userId }, postId)) {
    return res
      .status(CREATION_SUCCESSFULL)
      .send(successMessageWrapper(commentMessage.created))
  }
  res.status(BAD_REQUEST).send(errorMessageWrapper(commentMessage.error))
}

export const getComments = async (req, res) => {
  const postId = req.params.postId

  const comments = await findComments(postId)

  if (comments) {
    res.status(OK).send(successMessageWrapper(comments))
  }
  res.status(BAD_REQUEST).send(errorMessageWrapper(commentMessage.error))
}
