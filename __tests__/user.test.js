import { connectDB, disconnectDB } from '../config/db_config'
import { BAD_REQUEST, CREATION_SUCCESSFULL } from '../statusCodes'
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
    expect(res.body.error[0].message).toBe('Email already exists')
  })
  it('different email domain other than kct', async () => {
    const body = customer2
    const res = await request
      .post('/api/register')
      .set('Content-type', 'application/json')
      .send(body)
    // console.log(res.error)
    expect(res.status).toBe(BAD_REQUEST)
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
