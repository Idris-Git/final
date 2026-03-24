import Post from "../models/post.model.js";

// Public - get all posts for homepage
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
