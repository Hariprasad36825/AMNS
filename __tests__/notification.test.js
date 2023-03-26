import { connectDB, disconnectDB } from '../config/db_config'
import { NotificationMessage } from '../errorResponses'
import {
  createNotification,
  createUserNotification
} from '../services/notification.service'
import { createToken, createUser } from '../services/user.services'
import { CREATION_SUCCESS, INTERNAL_SERVER_ERROR, OK } from '../statusCodes'
import { emptyArray, sampleNotification } from '../testData/notification.data'
import { adminValid } from '../testData/user.data'
import { request } from './app.test'

describe('all request for api/notification', () => {
  let token, user
  const { name, username, password, type } = adminValid

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

  describe('POST /api/notification/addnotification', () => {
    it('valid notification details', async () => {
      const res = await request
        .post('/api/notification/addnotification')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send(sampleNotification)
      expect(res.status).toBe(CREATION_SUCCESS)
      expect(res.body.message).toBe(NotificationMessage.created)
    })
    it('invalid notification with empty array', async () => {
      const res = await request
        .post('/api/notification/addnotification')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send(emptyArray)
      expect(res.status).toBe(INTERNAL_SERVER_ERROR)
    })
  })

  describe('GET api/notification/getnotification', () => {
    beforeAll(async () => {
      const notification = await createNotification(sampleNotification)
      await createUserNotification(user._id, notification)
    })
    it("get user's all notifications", async () => {
      const res = await request
        .get('/api/notification/getnotification')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body).toBeInstanceOf(Array)
    })
  })
  describe('PUT api/notification/markread', () => {
    let userNotification
    beforeAll(async () => {
      const notification = await createNotification(sampleNotification)
      userNotification = await createUserNotification(user._id, notification)
    })
    it('mark notification as read for valid notification id', async () => {
      const id = userNotification._id.toString()
      const res = await request
        .put(`/api/notification/markread/${id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(OK)
      expect(res.body.message).toBe('Notification marked as read')
    })
  })
})
