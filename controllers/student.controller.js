import { BAD_REQUEST, CREATION_SUCCESSFULL } from '../statusCodes'
import { validationResult } from 'express-validator'
import { upsertStudents } from '../services/student.services'

export const addStudents = async (req, res) => {
  validationResult(req).throw()
  if (await upsertStudents(req.body.data)) {
    res.status(CREATION_SUCCESSFULL).send({ msg: 'success' })
  } else {
    res.status(BAD_REQUEST).send({ msg: 'Insertion Failed' })
  }
}
