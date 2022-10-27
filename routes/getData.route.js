import { Router } from 'express'
import { addLocation, getAllLocation } from '../controllers/data.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

export const LocationRouter = Router()

LocationRouter.get('/:searchStr', isAuthorised(), (req, res, next) => {
  wrapAsync(getAllLocation, req, res, next)
})

LocationRouter.post('/', isAuthorised(), (req, res, next) => {
  wrapAsync(addLocation, req, res, next)
})
