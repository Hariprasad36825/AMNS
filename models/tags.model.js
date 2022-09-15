import { Schema, model } from 'mongoose'

const tagsSchema = new Schema({
  tagset: [String]
})

export const TagsModel = model('Tags', tagsSchema)
