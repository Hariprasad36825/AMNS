import { Router } from 'express'
import {
  addNotification,
  getNotification,
  markAsRead
} from '../controllers/notification.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const NotificationRouter = Router()

NotificationRouter.post(
  '/addnotification',
  isAuthorised(),
  (req, res, next) => {
    wrapAsync(addNotification, req, res, next)
  }
)

NotificationRouter.get('/getnotification', isAuthorised(), (req, res, next) => {
  wrapAsync(getNotification, req, res, next)
})

NotificationRouter.put('/markread/:id', isAuthorised(), (req, res, next) => {
  wrapAsync(markAsRead, req, res, next)
})

export default NotificationRouter
