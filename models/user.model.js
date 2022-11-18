import { model, Schema } from 'mongoose'
import { defaultAvatar } from '../config/index'
import { Counter } from './counter.model'

const userSchema = new Schema({
  _id: {
    type: Number
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        const re = /(\w){4,15}/gim
        return re.test(val)
      },
      message: (props) => `${props.value} is not valid.`
    }
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        const re = /(@kct\.ac\.in)$/gim
        return !re.test(val)
      },
      message: (props) => `${props.value} must not be KCT email ID`
    }
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student'
  },
  tags: {
    type: [String]
  },
  status: {
    type: String,
    enum: ['active', 'not verified', 'suspended', 'not active'],
    default: 'active'
  },
  profilePic: {
    type: String,
    default: defaultAvatar
  }
})

userSchema.pre('save', async function () {
  const doc = this
  const counter = await Counter.findByIdAndUpdate(
    'entityId',
    { $inc: { user_counter: 1 } },
    { new: true, upsert: true }
  )
  doc._id = await counter.user_counter
})

export const UserModel = model('User', userSchema)
