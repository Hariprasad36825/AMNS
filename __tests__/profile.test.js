import { createStaff } from '../services/staff.services'
import { connectDB, disconnectDB } from '../config/db_config'
import { createStudent } from '../services/student.services'
import { createToken, createUser } from '../services/user.services'
import { INVALID_TOKEN, OK } from '../statusCodes'
import { staff1, staffData } from '../testData/staff.data'
import { student1, studentData } from '../testData/student.data'
import { request } from './app.test'

describe('GET /api/profile', () => {
  let staff, student, jwtTokenStaff, jwtTokenStudent
  beforeAll(async () => {
    await connectDB()
    try {
      staff = await createUser(
        staff1.name,
        staff1.email,
        staff1.password,
        staff1.type
      )
      student = await createUser(
        student1.name,
        student1.email,
        student1.password,
        student1.type
      )
      //   console.log('----testing---')
      jwtTokenStaff = createToken({
        _id: staff._id.toString(),
        type: staff.type
      })
      jwtTokenStudent = createToken({
        _id: student._id.toString(),
        type: student.type
      })

      await createStaff(staffData)
      await createStudent(studentData)
      // console.log(jwtTokenStaff)
      //   console.log(await getStaffProfile(staff._id))
    } catch (err) {
      console.error(err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('invalid token', async () => {
    const res = await request
      .get('/api/profile')
      .set('x-auth-token', 'g82f')
      .send()
    expect(res.status).toBe(INVALID_TOKEN)
    expect(res.body.errors).toBeInstanceOf(Array)
  })

  it('correct staff jwt token details', async () => {
    const res = await request
      .get('/api/profile')
      .set('x-auth-token', jwtTokenStaff)
      .send()
    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })

  it('correct student jwt token details', async () => {
    const res = await request
      .get('/api/profile')
      .set('x-auth-token', jwtTokenStudent)
      .send()
    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })

  it('correct public view of staff jwt token details', async () => {
    const res = await request
      .get('/api/profile/staff/1')
      .set('x-auth-token', jwtTokenStaff)
      .send()
    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })

  it('correct public view of student jwt token details', async () => {
    const res = await request
      .get('/api/profile/student/2')
      .set('x-auth-token', jwtTokenStudent)
      // .set('type', 'student')
      // .set('id', 2)
      .send()
    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
    // console.log(res.body)
  })
})
