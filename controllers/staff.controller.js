import { validationResult } from 'express-validator'
import { userError } from '../errorResponses'
import {
  getAllStaffs,
  getStudentOfStaff,
  upsertStaffs
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
