import { model, Schema } from 'mongoose'
import { UserModel } from './user.model'

const commentsSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: UserModel },
  name: String,
  body: String,
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ]
})

export const CommentsModel = model('Comments', commentsSchema)

// https://stackoverflow.com/questions/60399976/mongoose-how-to-query-self-referencing-relationship
