import { StaffModel } from '../models/staff.model'
import { StudentModel } from '../models/student.model'

export const getStudentOfStaff = async (staffId) => {
  const students = await StudentModel.find({
    'advisor._id': staffId,
    'academics.year': 2019
  })
  return students
}

export const createStaff = async (staff) => {
  return await StaffModel.insertMany(staff)
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
