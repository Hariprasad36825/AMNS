import mongoose, { model } from 'mongoose'

const dataSchema = mongoose.Schema({
  _id: {
    type: String,
    default: 1
  },
  skills: [String],
  company: [String],
  department: [String]
})

const locationSchema = mongoose.Schema({
  location: {
    type: String,
    lowercase: true
  }
})

export const DataModel = model('Data', dataSchema)
export const LocationModel = model('Location', locationSchema)
