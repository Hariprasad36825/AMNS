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
import { PostModel } from '../models/post.model'
import { findComments, saveComment } from '../services/comment.services'
import { addPost, getPost, getPosts } from '../services/post.services'
import { BAD_REQUEST, CREATION_SUCCESS, NOT_ACCEPTED, OK } from '../statusCodes'
import { createFormData } from '../utils/createFormData'

export const create = async (req, res) => {
  validationResult(req).throw()
  const user = req.user?._id
  const { caption, tags, attachments } = req.body

  if (await addPost({ user, caption, tags, attachments })) {
    return res
      .status(CREATION_SUCCESS)
      .send(successMessageWrapper(PostMessage.created))
  }
  res.status(BAD_REQUEST).send(errorMessageWrapper(PostMessage.error))
}

export const index = async (req, res) => {
  const posts = await getPosts()
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
      .status(CREATION_SUCCESS)
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

export const likePost = async (req, res) => {
  const postId = req.params.postId
  const userId = req.user?._id

  const post = await getPost(postId)

  if (post) {
    const isLiked = post.likes.includes(userId)

    if (!isLiked) {
      await PostModel.updateOne({ _id: postId }, { $push: { likes: userId } })
      return res.status(OK).send(successMessageWrapper(PostMessage.liked))
    }
  }
  res.status(NOT_ACCEPTED).send(errorMessageWrapper(PostMessage.liked_error))
}
