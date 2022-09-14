import { Schema, model } from 'mongoose'

const CounterSchema = Schema({
  _id: { type: String, required: true },
  user_counter: { type: Number, default: 0 }
})
export const counter = model('counter', CounterSchema)
