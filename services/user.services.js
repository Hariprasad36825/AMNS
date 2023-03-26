import bcrypt from 'bcryptjs'
import { StaffModel } from '../models/staff.model'
import { StudentModel } from '../models/student.model'

import { UserModel } from '../models/user.model'
import { createAuthToken, createRefreshToken } from './token.services'

export const getUserWithEmail = async (email) => {
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
  const user = new UserModel({ name, username, type })
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  await user.save()
  if (type === 'staff') {
    const staff = await StaffModel.findOrCreate({
      'personal_info.email': username
    })
    staff.doc.user_id = user.id
    staff.doc.save()
  } else if (type !== 'admin') {
    const student = await StudentModel.findOrCreate({
      'personal_info.email': username
    })
    student.doc.user_id = user.id
    student.doc.save()
  }
  return user
}

export const createToken = (user) => {
  const AccessToken = createAuthToken(user)
  const RefreshToken = createRefreshToken(user)
  const type = user.type
  return { AccessToken, RefreshToken, type }
}

export const comparePassword = async (password, user) => {
  return await bcrypt.compare(password, user.password)
}
