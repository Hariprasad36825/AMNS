import mongoose from 'mongoose'
import {
  NotificationModel,
  UserNotificationModel
} from '../models/notification.model'

export const createNotification = async (notification) => {
  return await NotificationModel.create(notification)
}

export const createUserNotification = async (user, notification) => {
  const notifs = await UserNotificationModel.create({
    user,
    notification
  })
  await notifs.save()
  return notifs
}

export const getUserNotifications = async (userId) => {
  const notifications = await UserNotificationModel.find(
    { user: userId },
    { __v: 0, user: 0 }
  ).populate({ path: 'notification', select: '-_id title description time' })

  return notifications
}

export const markRead = async (notifId) => {
  const query = await UserNotificationModel.updateOne(
    {
      _id: mongoose.Types.ObjectId(notifId)
    },
    {
      read: true
    }
  )
  if (query.matchedCount) return true
}
