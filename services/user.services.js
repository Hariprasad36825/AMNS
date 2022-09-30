import bcrypt from 'bcryptjs'

import { UserModel } from '../models/user.model'
import { createAuthToken, createRefreshToken } from './token.services'

export const getUserWithEmail = async (email) => {
  // console.log(email)
  return await UserModel.findOne({ username: email })
}

export const getUserWithId = async (id) => {
  const user = await UserModel.findById(id, {
    __v: 0,
    password: 0,
    createdAt: 0
  })
  return user
}

export const createUser = async (name, username, password, type) => {
  // console.log(username)
  const user = new UserModel({ name, username, type })
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  await user.save()
  return user
}

export const createToken = (user) => {
  const AccessToken = createAuthToken(user)
  const RefreshToken = createRefreshToken(user)
  return { AccessToken, RefreshToken }
}

export const comparePassword = async (password, user) => {
  return await bcrypt.compare(password, user.password)
}
