import { Schema, model } from 'mongoose'
import { UserModel } from './user.model'

const chatsSchema = new Schema({
  _id: { type: String, required: true },
  room_name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  messages: [
    {
      author: String,
      timestamp: { type: Date, default: Date.now },
      message: String,
      media: String
    }
  ]
})

export const ChatsModel = model('Chats', chatsSchema)

// incase of problem for future use
// https://stackoverflow.com/questions/64385442/add-timestamp-to-a-new-subdocument-or-subschema-in-mongoose
