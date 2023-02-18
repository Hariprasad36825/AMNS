import { NOTFOUND } from 'dns'
import { validationResult } from 'express-validator'
import fs from 'fs'
import path from 'path'
import { upload } from '../config/storage.config'
import {
  errorMessageWrapper,
  resourseMessages,
  userError
} from '../errorResponses'
import {
  getStaffProfile,
  getStaffProfilePublicView
} from '../services/staff.services'
import {
  getPersonalProfile,
  getStudentProfilePublicView
} from '../services/student.services'
import { createAuthToken } from '../services/token.services'
import {
  comparePassword,
  createToken,
  createUser,
  getUserWithEmail,
  getUserWithId
} from '../services/user.services'
import { ACCEPTED, BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'

export const registerUser = async (req, res) => {
  validationResult(req).throw()
  const { email, name, password, type } = req.body
  if (await getUserWithEmail(email)) {
    res.status(BAD_REQUEST).send(errorMessageWrapper(userError.exists))
  } else {
    const user = await createUser(name, email, password, type)
    res.status(CREATION_SUCCESSFULL).send(
      createToken({
        _id: user._id.toString(),
        type: user.type
      })
    )
  }
}

export const loginUser = async (req, res) => {
  validationResult(req).throw()
  const { email, password } = req.body

  const user = await getUserWithEmail(email)

  if (!user) {
    return res.status(BAD_REQUEST).send(errorMessageWrapper(userError.invalid))
  }

  const canLogin = await comparePassword(password, user)

  if (!canLogin) {
    return res.status(BAD_REQUEST).send(errorMessageWrapper(userError.invalid))
  }
  res.status(CREATION_SUCCESSFULL).send(
    createToken({
      _id: user._id.toString(),
      type: user.type
    })
  )
}

export const getUserDetails = async (req, res) => {
  const _id = req.user?._id
  if (!_id) throw new Error(userError.notDefined)
  res.status(OK).send(await getUserWithId(_id))
}

export const getProfile = async (req, res) => {
  const _id = req.user?._id
  const type = req.user?.type
  if (type === 'staff') res.status(OK).send(await getStaffProfile(_id))
  else if (type === 'student') {
    res.status(OK).send(await getPersonalProfile(_id))
  }
}

export const getProfilePublicView = async (req, res) => {
  const type = req.params.type
  const _id = req.params.id
  if (type === 'staff') {
    res.status(OK).send(await getStaffProfilePublicView(_id))
  } else if (type === 'student') {
    res.status(OK).send(await getStudentProfilePublicView(_id))
  }
}

export const GetAccessToken = async (req, res) => {
  const user = req.user
  const RefreshToken = req.body.refreshToken

  const AccessToken = createAuthToken(user)
  res.status(OK).send({ AccessToken, RefreshToken })
}

export const uploadFiles = async (req, res) => {
  // console.log("🚀 ~ file: user.controller.js ~ line 105 ~ upload.single ~ req.files", req.files)
  if (!req.files) {
    res.status(BAD_REQUEST).send({ msg: 'No files found' })
  }
  upload.single(req, res, (err) => {
    if (err) {
      res.status(BAD_REQUEST).send({ msg: 'upload Failed' })
    }

    res
      .status(OK)
      .send({ msg: 'upload success', fileName: req.files[0].filename })
  })
  res
    .status(OK)
    .send({ msg: 'upload success', fileName: req.files[0].filename })
}

export const deleteFile = (req, res) => {
  const fileName = req.params.fileName
  const filePath = path.join(process.cwd(), 'uploads', fileName)
  fs.unlinkSync(filePath)
  res.status(ACCEPTED).send({ msg: 'Deleted Successfully' })
}

export const getFileUrl = (req, res) => {
  const fileName = req.params.fileName
  const filePath = path.join(process.cwd(), 'uploads', fileName)

  if (fs.existsSync(filePath)) {
    return res.status(OK).send(new URL(`file:///${filePath}`).href)
  }
  res.status(NOTFOUND).send(errorMessageWrapper(resourseMessages.notFound))
}
