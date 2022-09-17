import { validationResult } from 'express-validator'
import { userError, wrapper } from '../errorResponses'
import {
  comparePassword,
  createToken,
  createUser,
  getUserWithEmail
} from '../services/user.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'

export const registerUser = async (req, res) => {
  // console.log('in')
  validationResult(req).throw()

  const { email, name, password, type } = req.body
  // console.log(password)
  if (await getUserWithEmail(email)) {
    // console.log(true)
    res.status(BAD_REQUEST).send(wrapper(userError.exists))
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

  const user = getUserWithEmail(email)

  if (!user) {
    return res.status(BAD_REQUEST).send(wrapper(userError.invalid))
  }
  const canLogin = comparePassword(password, user)

  if (!canLogin) {
    return res.status(BAD_REQUEST).send(wrapper(userError.invalid))
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
  res.status(OK).send(await getUserDetails(_id))
}
