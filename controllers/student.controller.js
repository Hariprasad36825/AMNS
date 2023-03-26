import { validationResult } from 'express-validator'
import {
  errorMessageWrapper,
  exportError,
  successMessageWrapper
} from '../errorResponses'
import {
  getAllStudents,
  getDefaultColumns,
  getPdf,
  getStudentColumns,
  getXLSX,
  upsertStudents
} from '../services/student.services'
import { BAD_REQUEST, CREATION_SUCCESS, OK } from '../statusCodes'

export const addStudents = async (req, res) => {
  validationResult(req).throw()
  if (await upsertStudents(req.body.data)) {
    res.status(CREATION_SUCCESS).send(successMessageWrapper('Student added'))
  } else {
    res
      .status(BAD_REQUEST)
      .send(errorMessageWrapper('Student details cannot be added'))
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
    res.status(BAD_REQUEST).send(errorMessageWrapper(exportError))
  } else if (format === 'pdf') {
    await getPdf(searchStr, filters, rawData, mappings, res)
  } else if (format === 'xlsx') {
    res.status(OK).send(await getXLSX(searchStr, filters, rawData, mappings))
  } else {
    res.status(BAD_REQUEST).send(errorMessageWrapper(exportError))
  }
}

export const getColumns = async (req, res) => {
  res.status(OK).send({
    columns: getStudentColumns(),
    default_coulumns: getDefaultColumns()
  })
}
