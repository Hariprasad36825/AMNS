import { validationResult } from 'express-validator'
import { userError } from '../errorResponses'
import {
  getAllStaffs,
  getDefaultColumns,
  getStaffColumns,
  getStudentOfStaff,
  upsertStaffs,
  getPdf,
  getXLSX
} from '../services/staff.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'

export const getStudentListUnderStaff = async (req, res) => {
  const staffID = req.user?._id
  if (!staffID) throw new Error(userError.notDefined)
  res.status(OK).send(await getStudentOfStaff(staffID))
}

export const addStaff = async (req, res) => {
  validationResult(req).throw()
  if (await upsertStaffs(req.body.data)) {
    res.status(CREATION_SUCCESSFULL).send({ msg: 'success' })
  } else {
    res.status(BAD_REQUEST).send({ msg: 'Insertion Failed' })
  }
}

export const getStaffs = async (req, res) => {
  const searchStr = req.body.searchStr
  const filters = req.body?.filter
  const records = req.params?.records
  const page = req.params?.page
  const skip = (page - 1) * records

  res.status(OK).send(await getAllStaffs(searchStr, filters, records, skip))
}

export const exportStaff = async (req, res) => {
  const searchStr = req.body.searchStr
  const filters = req.body?.filter
  const format = req.body.format
  const mappings = req.body.mappings
  const rawData = await getAllStaffs(searchStr, filters, Number.MAX_VALUE, 0)

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
  res
    .status(OK)
    .send({ columns: getStaffColumns(), default_coulumns: getDefaultColumns() })
}
