import { model, Schema } from 'mongoose'

const tokenShema = new Schema({
  uid: {
    type: String,
    required: true
  },
  user: {
    type: Number
  }
})

export const TokenModel = model('Token', tokenShema)
