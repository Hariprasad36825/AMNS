import { connectDB, disconnectDB } from '../config/db_config'
import { addPost } from '../services/post.services'
import { createToken, createUser } from '../services/user.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL, OK } from '../statusCodes'
import { invalidData, postDataValid } from '../testData/post.data'
import { studentValid1 } from '../testData/user.data'
import { request } from './app.test'

describe('all /api/post', () => {
  let token, user
  const { name, username, password, type } = studentValid1

  beforeAll(async () => {
    await connectDB()
    try {
      user = await createUser(name, username, password, type)
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

  describe('POST /api/post', () => {
    it('valid post data', async () => {
      const res = await request
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send(postDataValid)
      expect(res.status).toBe(CREATION_SUCCESSFULL)
    })

    it('missing feilds', async () => {
      const res = await request
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send(invalidData)
      expect(res.status).toBe(BAD_REQUEST)
      expect(res.body.errors[0].msg).toBe('caption is required')
    })
  })

  describe('GET api/post', () => {
    beforeAll(async () => {
      await addPost({ user: user.id, ...postDataValid })
    })
    it('getAllPosts', async () => {
      const res = await request
        .get('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send()
      expect(res.status).toBe(OK)
      expect(res.body.length).toBe(2)
    })
  })
})
