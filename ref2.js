const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fs09-social-network", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connect to DB"))
  .catch(console.log)

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: new Date() }
})
const Comment = mongoose.model("Comment", CommentSchema, "Comment");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
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
        content: data.content,
        postId: post._id
      })

      return newComment.save()
    })
    .then(comment => {
      console.log(comment)
    })
    .catch(console.log)
}

// createPost({
//   title: "Giới thiệu DENO",
//   content: "Deno là môi trường chạy NodeJS, được ra đời nhầm ....",
// })

// createComment("5eecc3334db32752fb445d63", {
//   content: "Bài viết rất hay và bổ ích"
// })

// createComment("5eecc3334db32752fb445d63", {
//   content: "Cảm ơn tác giả :)"
// })

// query comment including post
// Comment.find()
//   .populate("postId")
//   .then(console.log)
//   .catch(console.log)

// query post including comment
Post.findById("5eecc3334db32752fb445d63")
  .then(post => {
    if (!post) return Promise.reject({
      message: "Post not found"
    })

    return Promise.all([
      post,
      Comment.find({
        postId: post._id
      })
    ])
  })
  .then(res => {
    // res[0] => post
    // res[1] => danh sach comment
    const _post = {
      ...res[0]._doc,
      comments: res[1]
    }
    console.log(_post)
  })
  .catch(console.log)
