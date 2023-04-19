import { PostModel } from '../models/post.model'

export const addPost = async (body) => {
  return await PostModel.create(body)
}

export const getPosts = async () => {
  return await PostModel.find().populate('user', { name: 1, profilePic: 1 })
}

export const getPost = async (id) => {
  return await PostModel.findById(id)
}
