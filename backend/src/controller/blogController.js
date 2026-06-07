import BlogPost from "../models/blogPost.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const newPost = new BlogPost(req.body);
        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublishedPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const deleted = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
