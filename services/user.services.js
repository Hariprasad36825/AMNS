import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/index'
import { UserModel } from '../models/user.model'

export const getUserWithEmail = async (email) => {
  return await UserModel.findOne({ email })
}

export const getUserWithId = async (id) => {
  return await UserModel.findById({ id }).select('-password -__v -createdAt')
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
  const payload = {
    user
  }
  return jwt.sign(payload, jwtSecret, { expiresIn: '60 days' })
}

export const comparePassword = async (user, password) => {
  return await bcrypt.compare(password, user.password)
}
