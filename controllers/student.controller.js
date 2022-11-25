import { validationResult } from 'express-validator'
import {
  getAllStudents,
  getStudentColumns,
  upsertStudents
} from '../services/student.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'

export const addStudents = async (req, res) => {
  validationResult(req).throw()
  if (await upsertStudents(req.body.data)) {
    res.status(CREATION_SUCCESSFULL).send({ msg: 'success' })
  } else {
    res.status(BAD_REQUEST).send({ msg: 'Insertion Failed' })
  }
}

export const getStudents = async (req, res) => {
  const searchStr = req.body.searchStr
  const filters = req.body?.filter
  const records = req.params?.records
  const page = req.params?.page
  const skip = (page - 1) * records

  res.status(OK).send(await getAllStudents(searchStr, filters, records, skip))
}

export const getColumns = async (req, res) => {
  res.status(OK).send(getStudentColumns())
}
