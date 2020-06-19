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
  comments: [CommentSchema],
  createdAt: { type: Date, default: new Date() }
})
const Post = mongoose.model("Post", PostSchema, "Post");

/**
 * ===============================================
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

// createPost({
//   title: "Giới thiệu DENO",
//   content: "Deno là môi trường chạy NodeJS, được ra đời nhầm ....",
// })

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

      // comment duoc embed vao trong 1 bai Post cu the ==> ko co luu DB rieng
      post.comments.push(newComment)
      return post.save()
    })
    .then(post => {
      console.log(post)
    })
    .catch(console.log)
}

// createComment("5eecb7789c5a1b980d065e26", {
//   content: "Bài viết rất hay và bổ ích"
// })

createComment("5eecb7789c5a1b980d065e26", {
  content: "Cảm ơn tác giả :)"
})