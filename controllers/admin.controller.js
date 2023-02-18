import { validationResult } from 'express-validator'
import { errorMessageWrapper, userError, userMessage } from '../errorResponses'
import { createUser, getUserWithEmail } from '../services/user.services'
import { BAD_REQUEST, OK } from '../statusCodes'

export const AddStaffs = async (req, res) => {
  validationResult(req).throw()
  const staffs = req.body?.staffs

  for (let i = 0; i < staffs.length; i++) {
    const { name, email, type, password } = staffs[i]
    const isUser = await getUserWithEmail(email)

    if (isUser) {
      res.status(BAD_REQUEST).send(errorMessageWrapper(userError.exists))
    } else {
      await createUser(name, email, password, type)
    }
  }

  return res.status(OK).send({ message: userMessage.inserted })
}
