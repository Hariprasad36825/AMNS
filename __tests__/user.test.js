import { connectDB, disconnectDB } from '../config/db_config'
import { tokenError, userError } from '../errorResponses'
import { createToken, createUser } from '../services/user.services'
import {
  BAD_REQUEST,
  CREATION_SUCCESS,
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  OK
} from '../statusCodes'
import {
  studentValid1,
  studentValid2,
  studentValid3
} from '../testData/user.data'
import { request } from './app.test'

describe('POST api/register', () => {
  beforeAll(async () => {
    await connectDB()
  })
  afterAll(async () => {
    await disconnectDB()
  })
  it('correct details', async () => {
    const body = studentValid1
    body.email = body.username
    delete body.username
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(CREATION_SUCCESS)
    expect(res.body).toBeDefined()
  })
  it('no user details in body', async () => {
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send({})
    // console.log(res.text)
    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body.errors).toBeInstanceOf(Array)
  })
  it('Email already exits', async () => {
    const body = studentValid1
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body.errors[0].message).toBe('Email already exists')
  })
  it('email with kct domain', async () => {
    const body = studentValid2
    body.email = body.username
    delete body.username
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    // console.log(res.error)
    expect(res.status).toBe(INTERNAL_SERVER_ERROR)
  })
  it('invalid password', async () => {
    const body = studentValid3
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body.errors).toBeInstanceOf(Array)
  })
})

describe('POST api/login', () => {
  let jwtToken
  let user
  const { username: email, name, password, type } = studentValid1
  beforeAll(async () => {
    await connectDB()
    try {
      user = await createUser(name, email, password, type)
      jwtToken = createToken({
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

  it('login with valid credential', async () => {
    const body = {
      email,
      password
    }

    const res = await request
      .post('/api/login')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(CREATION_SUCCESS)
    expect(res.body).toBeDefined()
  })
  it('login with incorrect password', async () => {
    const body = {
      email,
      password: 'Sample@123'
    }
    const res = await request
      .post('/api/login')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body.errors[0].message).toEqual(userError.invalid)
  })

  describe('GET', () => {
    it('correct details', async () => {
      const res = await request
        .get('/api/login')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send()
      const { email, name, type } = res.body
      expect(res.status).toBe(OK)
      expect(email).toEqual(email)
      expect(name).toEqual(name)
      expect(type).toEqual(type)
    })
    it('invalid token', async () => {
      const res = await request
        .get('/api/login')
        .set('Authorization', 'Bearer sda')
        .send()
      expect(res.status).toBe(INVALID_TOKEN)
      expect(res.body.errors[0].message).toEqual(tokenError.invalid)
    })
  })
})
