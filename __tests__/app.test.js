import supertest from 'supertest'
import app from '../app'
import { OK } from '../statusCodes'
export const request = supertest(app)
describe('API tests', () => {
  describe('GET /', () => {
    it('sample get working', async () => {
      const res = await request.get('/')
      expect(res.status).toBe(OK)
    })
  })
})
