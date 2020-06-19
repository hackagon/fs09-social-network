const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fs09-social-network", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connect to DB"))
  .catch(console.log)

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: new Date() }
})
const Comment = mongoose.model("Comment", CommentSchema, "Comment");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  commentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  createdAt: { type: Date, default: new Date() }
})
const Post = mongoose.model("Post", PostSchema, "Post");

/**
 * ==============================================
 */
const createPost = async (data) => {
  // data: title, content
  const newPost = new Post({
    title: data.title,
    content: data.content
  })
  try {
    const savedPost = await newPost.save()
    console.log(savedPost)
    return savedPost;
  } catch (error) {
    console.log(error)
  }
}

const createComment = (postId, data) => {
  // data: content
  Post.findById(postId)
    .then(post => {
      if (!post) return Promise.reject({
        message: "Post not found"
      })

      const newComment = new Comment({
        content: data.content
      })

      post.commentIds.push(newComment._id)
      return Promise.all([
        post.save(),
        newComment.save()
      ])
    })
    .then(res => {
      // res[0] => post instance
      // res[1] => comment instance
      console.log(res[0])
    })
    .catch(console.log)
}

// createPost({
//   title: "Giới thiệu DENO",
//   content: "Deno là môi trường chạy NodeJS, được ra đời nhầm ....",
// })

// createComment("5eecbe763fddf70f6ee5aa83", {
//   content: "Bài viết rất hay và bổ ích"
// })

// createComment("5eecbe763fddf70f6ee5aa83", {
//   content: "Cảm ơn tác giả :)"
// })
Post.find()
  .populate("commentIds", "content")
  .then(res => {
    console.log(JSON.stringify(res, undefined, 2))
  })
  .catch(console.log)