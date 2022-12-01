import mongoose, { model, Schema } from 'mongoose'
import { UserModel } from './user.model'

const NotificationSchema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  time: {
    type: Date,
    default: Date.now()
  }
})

export const NotificationModel = model('Notification', NotificationSchema)

const UserNotificationSchema = mongoose.Schema({
  user: { type: Number, ref: UserModel },
  notification: { type: Schema.ObjectId, ref: NotificationModel },
  read: { type: Boolean, default: false }
})

export const UserNotificationModel = model(
  'UserNotification',
  UserNotificationSchema
)
