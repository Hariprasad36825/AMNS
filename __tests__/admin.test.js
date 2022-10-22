import { connectDB, disconnectDB } from '../config/db_config'
import { userMessage } from '../errorResponses'
import { createToken, createUser } from '../services/user.services'
import { OK } from '../statusCodes'
import { adminValid, staffsValid } from '../testData/user.data'
import { request } from './app.test'

// describe('add staff request', () => {
//   let adminToken
//   const staffs = staffsValid
//   // console.log('🚀 ~ file: staff.test.js ~ line 64 ~ describe ~ staffs', staffs)
//   const { name, username, password, type } = adminValid

//   beforeAll(async () => {
//     await connectDB()
//     try {
//       const admin = await createUser(name, username, password, type)

//       adminToken = createToken({
//         _id: admin._id.toString(),
//         type: admin.type
//       }).AccessToken
//     } catch (err) {
//       console.error(err)
//     }
//   })
//   afterAll(async () => {
//     await disconnectDB()
//   })

//   it('valid staff data', async () => {
//     const res = await request
//       .post('/api/addStaff')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .set('Content-type', 'application/json')
//       .send({ staffs })
//     // console.log('🚀 ~ file: staff.test.js ~ line 91 ~ it ~ res', res.body)
//     expect(res.status).toBe(OK)
//     expect(res.body.message).toBe(userMessage.inserted)
//   })
// })

describe('POST /api/addStaff', () => {
  let adminToken
  const staffs = staffsValid
  const { name, username, password, type } = adminValid
  beforeAll(async () => {
    await connectDB()
    try {
      const admin = await createUser(name, username, password, type)

      adminToken = createToken({
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
  it('valid staff data', async () => {
    const res = await request
      .post('/api/addStaff')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('Content-type', 'application/json')
      .send({ staffs })
    // console.log('🚀 ~ file: staff.test.js ~ line 91 ~ it ~ res', res.body)
    expect(res.status).toBe(OK)
    expect(res.body.message).toBe(userMessage.inserted)
  })
})
