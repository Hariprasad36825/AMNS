// Not implementeing for now the idea is as follows use the parent comment id from the request call and accordoingly proceed in saving the replies

// const addReplies = () => {}
// const addReply = async (req, res) => {
//     try {
//       const parentCommentId = req.params.commentId;
//       const parentComment = await CommentsModel.findById(parentCommentId);

//       if (!parentComment) {
//         return res.status(404).json({ error: 'Parent comment not found' });
//       }

//       const { name, body } = req.body;
//       const newComment = new CommentsModel({ name, body });
//       const savedComment = await newComment.save();

//       parentComment.replies.push(savedComment);
//       await parentComment.save();

//       res.json(savedComment);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   };
