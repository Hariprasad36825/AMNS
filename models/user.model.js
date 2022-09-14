import { Schema, model } from 'mongoose'

const userSchema = new Schema({
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
    required: true,
    validate: {
      validator: '/^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/',
      message: (props) => `${props.value} is not valid.`
    }
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

export const UserModel = model('User', userSchema)
