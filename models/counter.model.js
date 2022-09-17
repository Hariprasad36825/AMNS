import { model, Schema } from 'mongoose'

const CounterSchema = Schema({
  _id: { type: String, required: true },
  user_counter: { type: Number, default: 0 },
  staff_counter: { type: Number, default: 0 },
  post_counter: { type: Number, default: 0 }
})
export const Counter = model('Counter', CounterSchema)
