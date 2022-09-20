import { StudentModel } from '../models/student.model'

export const createStudent = async (students) => {
  await StudentModel.insertMany(students)
}
