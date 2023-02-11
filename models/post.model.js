import { model, Schema } from 'mongoose'
import { CommentsModel } from './comments.model'
import { Counter } from './counter.model'
import { TagsModel } from './tags.model'
import { UserModel } from './user.model'

const postsSchema = new Schema({
  _id: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Number,
    ref: UserModel,
    autopopulate: true
  },
  caption: {
    type: String,
    trim: true
  },
  tags: [String],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: UserModel
    }
  ],
  attachments: [String], // storing paths
  comment: {
    type: Schema.Types.ObjectId,
    ref: CommentsModel
  }
})

postsSchema.pre('save', async function () {
  const doc = this
  const newTags = doc.tags
  await TagsModel.updateOne({}, { $addToSet: { tagset: { $each: newTags } } })
  const counter = await Counter.findByIdAndUpdate(
    'entityId',
    { $inc: { post_counter: 1 } },
    { new: true, upsert: true }
  )
  doc._id = await counter.post_counter
})

export const PostModel = model('Posts', postsSchema)
