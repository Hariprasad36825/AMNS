import { connectDB, disconnectDB } from '../config/db_config'
import { tokenError, userError } from '../errorResponses'
import { createToken, createUser } from '../services/user.services'
import {
  BAD_REQUEST,
  CREATION_SUCCESSFULL,
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  OK
} from '../statusCodes'
import { customer1, customer2, customer3 } from '../testData/user.data'
import { request } from './app.test'

describe('POST api/register', () => {
  beforeAll(async () => {
    await connectDB()
  })
  afterAll(async () => {
    await disconnectDB()
  })
  it('correct details', async () => {
    const body = customer1
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(CREATION_SUCCESSFULL)
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
    const body = customer1
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    expect(res.status).toBe(BAD_REQUEST)
    expect(res.body.errors[0].message).toBe('Email already exists')
  })
  it('different email domain other than kct', async () => {
    const body = customer2
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    // console.log(res.error)
    expect(res.status).toBe(INTERNAL_SERVER_ERROR)
  })
  it('invalid password', async () => {
    const body = customer3
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
  const { email, name, password, type } = customer1
  beforeAll(async () => {
    await connectDB()
    try {
      user = await createUser(name, email, password, type)
      jwtToken = createToken({
        _id: user._id.toString(),
        type: user.type
      })
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
    expect(res.status).toBe(CREATION_SUCCESSFULL)
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
        .set('x-auth-token', jwtToken)
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
        .set('x-auth-token', '1234')
        .send()
      expect(res.status).toBe(INVALID_TOKEN)
      expect(res.body.errors[0].message).toEqual(tokenError.invalid)
    })
  })
})
