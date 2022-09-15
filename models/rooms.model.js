import { Schema, model } from 'mongoose'
import { ChatsModel } from './chats.model'
import { UserModel } from './user.model'

const roomSchema = Schema({
  user_id: { type: Schema.Types.ObjectId, ref: UserModel },
  rooms: [
    {
      room_id: { type: Schema.Types.ObjectId, ref: ChatsModel },
      room_name: String
    }
  ]
})

export const RoomsModel = model('Rooms', roomSchema)
