import { StaffModel } from '../models/staff.model'
import { StudentModel } from '../models/student.model'

export const getStudentOfStaff = async (staffId) => {
  const students = await StudentModel.find({
    'advisor._id': staffId,
    'academics.year': 2019
  })
  return students
}

export const createStaff = async (req) => {
  const staffs = await StaffModel.create(req)
  return staffs
}
