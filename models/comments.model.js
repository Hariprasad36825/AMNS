import { Schema, model } from 'mongoose'
import { PostsModel } from './posts.models'
import { UserModel } from './user.model'

const commentsSchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: PostsModel },
    user_id: { type: Schema.Types.ObjectId, ref: UserModel },
    name: String,
    replies: [this],
    body: String
  },
  { timestamps: true }
)

export const CommentsModel = model('Comments', commentsSchema)

// https://stackoverflow.com/questions/60399976/mongoose-how-to-query-self-referencing-relationship
