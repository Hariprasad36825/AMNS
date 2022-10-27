import { connectDB, disconnectDB } from '../config/db_config'
import { LocationMessage } from '../errorResponses'
import { setLocation } from '../services/data.services'
import { createToken, createUser } from '../services/user.services'
import { OK } from '../statusCodes'
import { locations } from '../testData/filter.data'
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

  describe('GET api/location', () => {
    beforeAll(async () => {
      await setLocation(locations)
    })

    it('get All Location starting with character c', async () => {
      const res = await request
        .get('/api/getAllLocation/c')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('POST api/addLocation', () => {
    it('add single location', async () => {
      const res = await request
        .post('/api/addLocation')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ location: 'chennai' })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(LocationMessage.added)
    })

    it('add list of location', async () => {
      const res = await request
        .post('/api/addLocation')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send({ location: locations })
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe(LocationMessage.added)
    })
  })
})
