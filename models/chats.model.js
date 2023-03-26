import { Schema, model } from 'mongoose'
import findOrCreatePlugin from '../node_modules/mongoose-findorcreate/index'
import { UserModel } from './user.model'

const chatsSchema = new Schema({
  room_name: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  messages: [
    {
      author: { type: Schema.Types.ObjectId, ref: UserModel },
      timestamp: { type: Date, default: Date.now },
      message: String,
      media: String
    }
  ]
})

chatsSchema.plugin(findOrCreatePlugin)
export const ChatsModel = model('Chats', chatsSchema)

// incase of problem for future use
// https://stackoverflow.com/questions/64385442/add-timestamp-to-a-new-subdocument-or-subschema-in-mongoose
