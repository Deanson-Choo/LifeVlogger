import express from 'express'
import Post from "../models/Post.js"
import cloudinary from "../lib/cloudinary.js"
import protectRoute from "../middleware/auth.middleware.js"

const postRouter = express.Router();

postRouter.post("/", protectRoute, async (req, res) => {
    const { title, content, image } = req.body;
    const user = req.user;

    if (!title || !image) {
        return res.status(400).json({ message: "Title and image are required" })
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image) // image is in base64 format
    const imageUrl = uploadResponse.secure_url; 

    try {
        const newPost = new Post({
            title,
            content,
            image: imageUrl,
            user: user._id
        })
        
        await newPost.save();

        res.status(201).json({ message: "Post created successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
});

postRouter.get("/", protectRoute, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id }) // only fetch posts of the logged in user
                        .populate('user', 'username email');

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error: Failed to fetch posts" })
    }
});

export default postRouter;