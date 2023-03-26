import { connectDB, disconnectDB } from '../config/db_config'
import { upsertStaffs } from '../services/staff.services'
import { createStudent } from '../services/student.services'
import { createToken, createUser } from '../services/user.services'
import {
  BAD_REQUEST,
  CREATION_SUCCESS,
  DB_ERROR,
  FORBIDDEN_REQUEST,
  OK
} from '../statusCodes'
import {
  InvalidStaffData,
  properStaffData,
  staff1
} from '../testData/staff.data'
import { student1, studentData } from '../testData/student.data'
import { adminValid } from '../testData/user.data'
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

describe('POST /api/staff/addstaffs', () => {
  let jwtTokenStaff
  let admin
  const { username, name, type, password } = adminValid
  beforeAll(async () => {
    await connectDB()
    try {
      admin = await createUser(name, username, password, type)
      jwtTokenStaff = createToken({
        _id: admin._id.toString(),
        type: admin.type
      }).AccessToken
    } catch (err) {
      console.error(err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('correct details', async () => {
    const body = properStaffData
    const res = await request
      .post('/api/staff/addstaffs')
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .set('Content-type', 'application/json')
      .send({ data: body })

    expect(res.status).toBe(CREATION_SUCCESS)
    expect(res.body).toBeDefined()
  })

  it('inCorrect details', async () => {
    const body = InvalidStaffData
    const res = await request
      .post('/api/staff/addstaffs')
      .set('Authorization', `Bearer ${jwtTokenStaff}`)
      .set('Content-type', 'application/json')
      .send({ data: body })

    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body).toBeDefined()
  })
})

describe('POST api/staff get staff', () => {
  let token
  const { name, username, password, type } = adminValid
  beforeAll(async () => {
    await connectDB()

    try {
      const user = await createUser(name, username, password, type)

      token = createToken({
        _id: user._id.toString(),
        type: user.type
      }).AccessToken

      await upsertStaffs(properStaffData)
    } catch (err) {
      console.error(err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  it('only with search string', async () => {
    const body = {
      searchStr: 'stafft'
    }
    const res = await request
      .post('/api/staff/1/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeInstanceOf(Array)
  })
  it('with search string and filters', async () => {
    const body = {
      searchStr: 'staff',
      filter: {
        'academics.department_name': ['cse', 'it']
      }
    }
    const res = await request
      .post('/api/staff/1/1')
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
      .post('/api/staff/1/1')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(DB_ERROR)
  })
})

describe('POST /api/staff/exportData', () => {
  let token
  const { name, username, password, type } = adminValid
  beforeAll(async () => {
    await connectDB()

    try {
      const user = await createUser(name, username, password, type)

      token = createToken({
        _id: user._id.toString(),
        type: user.type
      }).AccessToken
      await upsertStaffs(properStaffData)
    } catch (err) {
      console.error(err)
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
      .post('/api/staff/exportData')
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
        Name: 'personal_info.name',
        Email: 'personal_info.email',
        Phone: 'personal_info.phone',
        Location: 'personal_info.location',
        'Department name': 'work_exp.department_name',
        Designation: 'work_exp.designation'
      }
    }
    const res = await request
      .post('/api/staff/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body).toBeDefined()
  })
  it('correct format for PDF', async () => {
    const body = {
      searchStr: 's',
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
      .post('/api/staff/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeDefined()
  })

  it('correct format for xlsx', async () => {
    const body = {
      searchStr: 's',
      filter: {},
      format: 'xlsx',
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
      .post('/api/staff/exportData')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type', 'application/json')
      .send(body)

    expect(res.status).toBe(OK)
    expect(res.body).toBeDefined()
  })
})
