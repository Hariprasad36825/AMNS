import { StaffModel } from '../models/staff.model'
import { StudentModel } from '../models/student.model'

export const getStudentOfStaff = async (staffId) => {
  const students = await StudentModel.find({
    'advisor._id': staffId,
    'academics.year': 2019
  })
  return students
}

export const getStaffProfile = async (staffId) => {
  return await StaffModel.find(
    { user_id: staffId },
    { __v: 0, _id: 0, user_id: 0 }
  )
}

export const getStaffProfilePublicView = async (staffId) => {
  return await StaffModel.find(
    { user_id: staffId },
    {
      __v: 0,
      _id: 0,
      user_id: 0,
      'personal_info.email': 0,
      'personal_info.phone': 0,
      'personal_info.location': 0
    }
  )
}

export const upsertStaffs = async (docs) => {
  return await StaffModel.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { 'personal_info.email': doc.personal_info.email },
        update: doc,
        upsert: true
      }
    }))
  )
}

export const getAllStaffs = async (searchStr, filter, records, skip) => {
  const nameQuery = { 'personal_info.name': { $regex: searchStr } }
  const query =
    searchStr !== ''
      ? { $or: [nameQuery, { $text: { $search: searchStr } }] }
      : { ...nameQuery }

  typeof filter !== 'undefined' &&
    Object.entries(filter).map(([key, value]) =>
      key === 'skills'
        ? (query[`${key}`] = { $elemMatch: { $in: value } })
        : (query[`${key}`] = { $in: value })
    )

  const staffs = await StaffModel.find(query, {
    'personal_info.birthday': 0,
    'personal_info.gender': 0
  })
    .populate({ path: 'user_id', select: 'profilePic' })
    .skip(skip)
    .limit(records)
  return staffs
}
