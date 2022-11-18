import { StudentModel } from '../models/student.model'

export const createStudent = async (students) => {
  await StudentModel.insertMany(students)
}

export const getPersonalProfile = async (studentId) => {
  return await StudentModel.find(
    { user_id: studentId },
    {
      __v: 0,
      _id: 0,
      user_id: 0,
      'advisor._id': 0
    }
  )
}
export const getStudentProfilePublicView = async (studentId) => {
  return await StudentModel.find(
    { user_id: studentId },
    {
      __v: 0,
      _id: 0,
      user_id: 0,
      'personal_info.roll_no': 0,
      'personal_info.birthday': 0,
      'personal_info.email': 0,
      'personal_info.phone': 0,
      'personal_info.location': 0,
      advisor: 0
    }
  )
}

export const upsertStudents = async (docs) => {
  return await StudentModel.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { 'personal_info.roll_no': doc.personal_info.roll_no },
        update: doc,
        upsert: true
      }
    }))
  )
}

export const getAllStudents = async (searchStr, filter, records, skip) => {
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

  const students = await StudentModel.find(query, {
    'personal_info.birthday': 0,
    'personal_info.gender': 0
  })
    .populate({ path: 'user_id', select: 'profilePic' })
    .skip(skip)
    .limit(records)
  return students
}
