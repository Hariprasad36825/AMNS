import { CommentsModel } from '../models/comments.model'
import { PostModel } from '../models/post.model'

export const saveComment = async (payload, postId) => {
  const post = await PostModel.findById(postId)

  if (!post) {
    return false
  }

  const comment = new CommentsModel({
    user_id: payload.userId,
    name: payload.name,
    body: payload.body
  })

  await CommentsModel.save(comment)

  post.comment = comment

  return await post.save()
}

export const findComments = async (postId) => {
  const post = await PostModel.findById(postId).populate('comment')

  if (!post) {
    return false
  }

  const comments = await CommentsModel.find({
    _id: { $in: post.comment }
  }).populate('replies')

  const commentsWithReplies = comments.map((comment) => {
    return {
      _id: comment._id,
      name: comment.name,
      body: comment.body,
      replies: comment.replies,
      repliesCount: comment.replies.length
    }
  })

  return commentsWithReplies
}
