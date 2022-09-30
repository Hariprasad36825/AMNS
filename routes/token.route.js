import { Router } from 'express'
import { GetAccessToken } from '../controllers/user.controller'
import { verifyToken } from '../middleware/refresh.middleware'
import wrapAsync from '../utils/wrapAsync'

const tokenRouter = Router()

tokenRouter.post('/', verifyToken(), (req, res, next) => {
  wrapAsync(GetAccessToken, req, res, next)
})

export default tokenRouter
