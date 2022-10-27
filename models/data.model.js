import mongoose, { model } from 'mongoose'

const dataSchema = mongoose.Schema({
  skills: [String],
  company: [String],
  department: [String]
})

export const DataModel = model('Data', dataSchema)
