import { connectDB, disconnectDB } from '../config/db_config'
import { upsertStudents } from '../services/student.services'
import { createToken, createUser } from '../services/user.services'
import { BAD_REQUEST, CREATION_SUCCESS, DB_ERROR, OK } from '../statusCodes'
import { staff1 } from '../testData/staff.data'
import { studentData, studentData1 } from '../testData/student.data'
import { adminValid } from '../testData/user.data'
import { request } from './app.test'
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
      .post('/api/student')
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .send(body)
    expect(res.status).toBe(CREATION_SUCCESS)
    expect(res.body).toBeDefined()
  })

  it('inCorrect details', async () => {
    const body = studentData
    const res = await request
      .post('/api/student')
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .send({ data: body })

    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body).toBeDefined()
  })
})

describe('POST api/student get students', () => {
  let token
  const { name, username, password, type } = adminValid
  beforeAll(async () => {
    await connectDB()

    try {
      const user = await createUser(name, username, password, type)
      await createUser(name, username, password, 'staff')

      token = createToken({
        _id: user._id.toString(),
        type: user.type
      }).AccessToken

      await upsertStudents(studentData1.data)
    } catch (err) {
      console.error('err>>', err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('only with search string', async () => {
    const body = {
      searchStr: 'd'
    }
    const res = await request
      .post('/api/student/1/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })
  it('with search string and filters', async () => {
    const body = {
      searchStr: 'd',
      filter: {
        'academics.department_name': ['cse', 'it'],
        skills: ['c']
      }
    }
    const res = await request
      .post('/api/student/1/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })
  it('without search string', async () => {
    const body = {
      filter: {
        'academics.department_name': ['cse', 'it'],
        skills: ['c']
      }
    }
    const res = await request
      .post('/api/student/1/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(DB_ERROR)
  })
})

describe('POST /api/student/exportData', () => {
  let token
  const { name, username, password, type } = adminValid

  beforeAll(async () => {
    await connectDB()

    try {
      const user = await createUser(name, username, password, type)
      await createUser(name, username, password, 'staff')

      token = createToken({
        _id: user._id.toString(),
        type: user.type
      }).AccessToken
      await upsertStudents(studentData1.data)
    } catch (err) {
      console.error('error >>>', err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('empty searchstr, mappings, format', async () => {
    const body = {
      searchStr: '',
      filter: {},
      format: '',
      mappings: {}
    }
    const res = await request
      .post('/api/student/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body).toBeDefined()
  })

  it('wrong format', async () => {
    const body = {
      searchStr: 'd',
      filter: {},
      format: 'qwe',
      mappings: {
        name: 'personal_info.name',
        roll_no: 'personal_info.roll_no',
        gender: 'personal_info.gender',
        birthday: 'personal_info.birthday',
        email: 'personal_info.email',
        phone: 'personal_info.phone',
        'Current Location': 'personal_info.location',
        'company Name': 'work_exp.company_name',
        designation: 'work_exp.designation',
        'advisor name': 'advisor.name',
        'department name': 'academics.department_name',
        batch: 'academics.year'
      }
    }
    const res = await request
      .post('/api/student/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body).toBeDefined()
  })

  it('correct details for pdf', async () => {
    const body = {
      searchStr: 'd',
      filter: {},
      format: 'pdf',
      mappings: {
        Name: 'personal_info.name',
        Email: 'personal_info.email',
        Phone: 'personal_info.phone',
        Location: 'personal_info.location',
        'Department name': 'work_exp.department_name',
        Designation: 'work_exp.designation'
      }
    }
    const res = await request
      .post('/api/student/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeDefined()
  })

  it('correct details for xlsx', async () => {
    const body = {
      searchStr: 'd',
      filter: { 'academics.department_name': ['cse', 'it'] },
      format: 'xlsx',
      mappings: {
        name: 'personal_info.name',
        roll_no: 'personal_info.roll_no',
        gender: 'personal_info.gender',
        birthday: 'personal_info.birthday',
        email: 'personal_info.email',
        phone: 'personal_info.phone',
        'Current Location': 'personal_info.location',
        'company Name': 'work_exp.company_name',
        designation: 'work_exp.designation',
        'advisor name': 'advisor.name',
        'department name': 'academics.department_name',
        batch: 'academics.year'
      }
    }
    const res = await request
      .post('/api/student/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeDefined()
  })
})
