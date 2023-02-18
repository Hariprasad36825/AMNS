import { connectDB, disconnectDB } from '../config/db_config'
import {
  CompanyMessage,
  DepartmentMessage,
  LocationMessage,
  SkillMessage
} from '../errorResponses'
import {
  setCompany,
  setDepartment,
  setLocation,
  setSkills
} from '../services/data.services'
import { createToken, createUser } from '../services/user.services'
import { OK } from '../statusCodes'
import { company, department, locations, skills } from '../testData/filter.data'
import { adminValid } from '../testData/user.data'
import { request } from './app.test'

describe('GET for all Filter Data', () => {
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
    } catch (err) {
      console.error(err)
    }
  })
  afterAll(async () => {
    await disconnectDB()
  })

  // location test cases

  describe('GET api/location', () => {
    beforeAll(async () => {
      await setLocation(locations)
    })

    it('get All Location starting with character c', async () => {
      const res = await request
        .get('/api/location/c')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('POST api/loaction', () => {
    it('add single location', async () => {
      const res = await request
        .post('/api/location')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ location: 'chennai' })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(LocationMessage.added)
    })

    it('add list of location', async () => {
      const res = await request
        .post('/api/location')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ location: locations })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(LocationMessage.added)
    })
  })

  // company test cases

  describe('GET api/company', () => {
    beforeAll(async () => {
      await setCompany(company)
    })

    it('get All company starting with character a', async () => {
      const res = await request
        .get('/api/company/a')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('POST api/company', () => {
    it('add single company', async () => {
      const res = await request
        .post('/api/company')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ company: 'apple' })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(CompanyMessage.added)
    })

    it('add list of companies', async () => {
      const res = await request
        .post('/api/company')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ company })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(CompanyMessage.added)
    })
  })

  // department test cases

  describe('GET api/department', () => {
    beforeAll(async () => {
      await setDepartment(1, department)
    })

    it('get dept as instance of array', async () => {
      const res = await request
        .get('/api/department')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('POST api/department', () => {
    it('add single department', async () => {
      const res = await request
        .post('/api/department')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ department: 'cse' })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(DepartmentMessage.added)
    })

    it('add list of departments', async () => {
      const res = await request
        .post('/api/department')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ department })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(DepartmentMessage.added)
    })
  })

  // skills test cases

  describe('GET api/skills', () => {
    beforeAll(async () => {
      await setSkills(1, skills)
    })

    it('get skills as instance of array', async () => {
      const res = await request
        .get('/api/skills')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('POST api/skills', () => {
    it('add single skill', async () => {
      const res = await request
        .post('/api/skills')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ skills: 'javascript' })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(SkillMessage.added)
    })

    it('add list of skills', async () => {
      const res = await request
        .post('/api/skills')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ skills })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(SkillMessage.added)
    })
  })

  // advisors test cases

  describe('GET api/advisor', () => {
    // beforeAll(async () => {
    //   await upsertStaffs(properStaffData)
    // })

    it('get All advisor names', async () => {
      const res = await request
        .get('/api/advisor')
        .set('Authorization', `Bearer ${token}`)
      // console.log(res.body)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })
})
