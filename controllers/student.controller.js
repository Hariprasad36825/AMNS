import { validationResult } from 'express-validator'
import {
  getAllStudents,
  getDefaultColumns,
  getPdf,
  getStudentColumns,
  getXLSX,
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

export const exportStudents = async (req, res) => {
  const searchStr = req.body.searchStr
  const filters = req.body?.filter
  const format = req.body.format
  const mappings = req.body.mappings
  const rawData = await getAllStudents(searchStr, filters, Number.MAX_VALUE, 0)

  if (
    searchStr.length <= 0 ||
    format.length <= 0 ||
    Object.keys(mappings) <= 0 ||
    rawData.length <= 0
  ) {
    res.status(BAD_REQUEST).send({ msg: 'export failed' })
  } else if (format === 'pdf') {
    await getPdf(searchStr, filters, rawData, mappings, res)
  } else if (format === 'xlsx') {
    res.status(OK).send(await getXLSX(searchStr, filters, rawData, mappings))
  } else {
    res.status(BAD_REQUEST).send({ msg: 'wrong format' })
  }
}

export const getColumns = async (req, res) => {
  res.status(OK).send({
    columns: getStudentColumns(),
    default_coulumns: getDefaultColumns()
  })
}
