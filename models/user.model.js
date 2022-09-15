import { model, Schema } from 'mongoose'
import { Counter } from './counter.model'

const userSchema = new Schema({
  _id: {
    type: Number
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: '/(([a-zA-Z0-9_]+\\.*)+(@kct.ac.in))/gmi',
      message: (props) => `${props.value} is not an official email ID`
    }
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: '/(\\w){4,15}/gmi',
      message: (props) => `${props.value} is not valid.`
    }
  },
  password: {
    type: String,
    required: true
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
  }
})

userSchema.pre('save', async function () {
  const doc = this
  await Counter.updateOne(
    {},
    { $inc: { user_counter: 1 } },
    function (counter) {
      doc._id = counter.user_counter
    }
  )
})

export const UserModel = model('User', userSchema)
