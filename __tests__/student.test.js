import { connectDB, disconnectDB } from '../config/db_config'
import { createToken, createUser } from '../services/user.services'
import { staff1 } from '../testData/staff.data'
import { studentData, studentData1 } from '../testData/student.data'
import { request } from './app.test'
import {
  BAD_REQUEST,
  CREATION_SUCCESSFULL
} from '../statusCodes'
describe('POST /api/student/addstudents', () => {
  let jwtTokenStaff
  let staff
  const { email, name, type, password } = staff1
  beforeAll(async () => {
    await connectDB()
    try {
      staff = await createUser(name, email, password, type)
      jwtTokenStaff = createToken({
        _id: staff._id.toString(),
        type: staff.type
      }).AccessToken
    } catch (err) {
      console.error(err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('correct details', async () => {
    const body = studentData1
    const res = await request
      .post('/api/student/addstudents')
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .send(body)

    expect(res.status).toBe(CREATION_SUCCESSFULL)
    expect(res.body).toBeDefined()
  })

  it('inCorrect details', async () => {
    const body = studentData
    const res = await request
      .post('/api/student/addstudents')
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .send({ data: body })

    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body).toBeDefined()
  })
})
