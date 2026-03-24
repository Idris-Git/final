import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
