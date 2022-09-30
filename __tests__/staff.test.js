import { connectDB, disconnectDB } from '../config/db_config'
import { createStudent } from '../services/student.services'
import { createToken, createUser } from '../services/user.services'
import { FORBIDDEN_REQUEST, OK } from '../statusCodes'
import { staff1 } from '../testData/staff.data'
import { student1, studentData } from '../testData/student.data'
import { request } from './app.test'

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
      }).AccessToken
      jwtTokenStudent = createToken({
        _id: student._id.toString(),
        type: student.type
      }).AccessToken
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
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .send()
    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })
  it('unauthorized user', async () => {
    const res = await request
      .get('/api/getstudentofstaff')
      .set('Authorization', `Bearer ${jwtTokenStudent}`)
      .send()
    expect(res.status).toBe(FORBIDDEN_REQUEST)
  })
})
