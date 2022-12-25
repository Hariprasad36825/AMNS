import { NotificationMessage } from '../errorResponses'
import { validationResult } from '../node_modules/express-validator/src/validation-result'
import {
  createNotification,
  createUserNotification,
  getUserNotifications,
  markRead
} from '../services/notification.service'
import { CREATION_SUCCESSFULL, OK } from '../statusCodes'

export const addNotification = async (req, res) => {
  validationResult(req).throw()

  const user = req.user?._id
  const notification = await createNotification(req.body)

  await createUserNotification(user, notification)
  res
    .status(CREATION_SUCCESSFULL)
    .send({ message: NotificationMessage.created })
}

export const getNotification = async (req, res) => {
  const user = req.user?._id
  res.status(OK).send(await getUserNotifications(user))
}

export const markAsRead = async (req, res) => {
  const notifId = req.params.id
  if (await markRead(notifId)) {
    res.status(OK).send({ message: 'Notification marked as read' })
  } else {
    res.status(OK).send({ message: 'Notification does not exist' })
  }
}
