import { PostModel } from '../models/post.model'

export const addPost = async (body) => {
  return await PostModel.create(body)
}

export const getPost = async () => {
  return await PostModel.find().populate('user', { name: 1 })
}
