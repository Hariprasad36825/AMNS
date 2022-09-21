import { connectDB, disconnectDB } from '../config/db_config'
import { createToken, createUser } from '../services/user.services'
import { request } from './app.test'
import { staff1 } from '../testData/staff.data'
import { student1, studentData } from '../testData/student.data'
import { OK, FORBIDDEN_REQUEST } from '../statusCodes'
import { createStudent } from '../services/student.services'

describe('GET /api/getstudentofstaff', () => {
  let jwtTokenStaff, jwtTokenStudent
  let staff, student
  const { email, name, type, password } = staff1
  beforeAll(async () => {
    await connectDB()
    try {
      staff = await createUser(name, email, password, type)
      student = await createUser(
        student1.name,
        student1.email,
        student1.password
      )
      jwtTokenStaff = createToken({
        _id: staff._id.toString(),
        type: staff.type
      })
      jwtTokenStudent = createToken({
        _id: student._id.toString(),
        type: student.type
      })
    } catch (err) {
      console.error(err)
    }
    try {
      await createStudent(studentData)
    } catch (err) {
      console.error(err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('valid instance of array', async () => {
    const res = await request
      .get('/api/getstudentofstaff')
      .set('x-auth-token', jwtTokenStaff)
      .send()
    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })
  it('unauthorized user', async () => {
    const res = await request
      .get('/api/getstudentofstaff')
      .set('x-auth-token', jwtTokenStudent)
      .send()
    expect(res.status).toBe(FORBIDDEN_REQUEST)
  })
})
